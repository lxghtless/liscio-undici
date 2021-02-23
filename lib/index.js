const {STATUS_CODES} = require('http')
const undici = require('undici')
const {makeLogger, shapeUtil} = require('@lxghtless/brokkr')

const {isArray, isNil, isObject, isString, validateAndParse} = shapeUtil

const log = makeLogger()

class LiscioError extends Error {
    constructor(message, statusCode, errorResponse) {
        super(message)
        this.name = 'LiscioError'
        this.statusCode = statusCode
        this.status = STATUS_CODES[this.statusCode]
        this.errorResponse = errorResponse
    }
}

const createHttpClient = (baseUrl, undiciOptions) =>
    new undici.Client(baseUrl, undiciOptions)

const InterceptorSchema = {
    name: 'string',
    handler: 'function',
    config: '?object',
    throwError: '?boolean'
}

const applicationJson = 'application/json'
const jsonContentTypeHeaders = {
    'content-type': applicationJson
}

const headersHaveContentTypeJson = headers => {
    if (isNil(headers) || !isObject(headers)) {
        return false
    }

    let contentType = headers['content-type']

    if (isNil(contentType)) {
        contentType = headers['Content-Type']
    }

    if (isNil(contentType)) {
        return false
    }

    return contentType.toLowerCase().startsWith(applicationJson)
}

const JsonParserResponseInterceptor = {
    name: 'liscio-json-response',
    handler: responseInfo => {
        const {data, response} = responseInfo
        if (data && headersHaveContentTypeJson(response.headers)) {
            if (data instanceof Buffer) {
                responseInfo.data = JSON.parse(data.toString())
            }
            if (isString(data)) {
                responseInfo.data = JSON.parse(data)
            }
        }
    }
}

const JsonStringifyRequestInterceptor = {
    name: 'liscio-json-request',
    handler: requestInfo => {
        const {body, headers} = requestInfo
        if (requestInfo.body && isObject(body)) {
            requestInfo.body = JSON.stringify(body)
            requestInfo.headers = headers
                ? {...headers, ...jsonContentTypeHeaders}
                : jsonContentTypeHeaders
        }
    }
}

const DefaultInterceptors = {
    JsonParserResponseInterceptor,
    JsonStringifyRequestInterceptor
}

const makeRequest = (client, opts) => {
    const {headers, requestInterceptors, responseInterceptors} = opts
    return async requestArgs => {
        const requestOptions = {...requestArgs}
        requestOptions.headers = requestOptions.headers
            ? Object.assign(requestOptions.headers, headers)
            : headers

        // here we assume valid shape because it validated previously
        if (requestInterceptors) {
            for (const {
                name,
                handler,
                config,
                throwError
            } of requestInterceptors) {
                try {
                    await handler(requestOptions, config)
                } catch (error) {
                    if (throwError) {
                        throw error
                    }
                    log.error(
                        `failed to call request interceptor "${name}"`,
                        error
                    )
                }
            }
        }
        const response = await client.request(requestOptions)
        const {statusCode, body} = response

        const chunks = []

        for await (const chunk of body) {
            chunks.push(chunk)
        }

        const data = Buffer.concat(chunks)

        if (statusCode > 299) {
            return Promise.reject(
                new LiscioError(
                    'Unexpected statusCode',
                    statusCode,
                    data.toString()
                )
            )
        }

        const responseWrapper = {response, data}

        if (responseInterceptors) {
            for (const {
                name,
                handler,
                config,
                throwError
            } of responseInterceptors) {
                try {
                    await handler(responseWrapper, config)
                } catch (error) {
                    if (throwError) {
                        throw error
                    }
                    log.error(
                        `failed to call response interceptor "${name}"`,
                        error
                    )
                }
            }
        }

        return responseWrapper.data
    }
}

const validateInterceptors = ({requestInterceptors, responseInterceptors}) => {
    for (const interceptors of [requestInterceptors, responseInterceptors]) {
        if (isArray(interceptors)) {
            for (const interceptor of interceptors) {
                const iValidation = validateAndParse(
                    InterceptorSchema,
                    interceptor
                )
                if (!iValidation.isValid) {
                    throw new LiscioError(
                        'Invalid Interceptor',
                        400,
                        JSON.stringify(iValidation.errors, undefined, 4)
                    )
                }
            }
        }
    }
}

const clientOptionsSchema = {
    baseUrl: 'string',
    requestInterceptors: '?[]object',
    responseInterceptors: '?[]object',
    userAgent: '?string',
    undiciOptions: '?object',
    json: '?boolean'
}

const httpClientFactory = clientOptions => {
    const cValidation = validateAndParse(clientOptionsSchema, clientOptions)
    if (!cValidation.isValid) {
        throw new LiscioError(
            'Invalid client options',
            400,
            JSON.stringify(cValidation.errors, undefined, 4)
        )
    }

    const {
        baseUrl,
        requestInterceptors,
        responseInterceptors,
        userAgent,
        undiciOptions,
        json
    } = clientOptions

    validateInterceptors({requestInterceptors, responseInterceptors})

    const httpClient = createHttpClient(baseUrl, undiciOptions)

    const headers = {
        'user-agent': userAgent || 'liscio-undici'
    }

    let _requestInterceptors = requestInterceptors
    let _responseInterceptors = responseInterceptors

    if (json === true) {
        _requestInterceptors = requestInterceptors || []
        _responseInterceptors = responseInterceptors || []

        _requestInterceptors.push(
            DefaultInterceptors.JsonStringifyRequestInterceptor
        )
        _responseInterceptors.push(
            DefaultInterceptors.JsonParserResponseInterceptor
        )
    }

    const request = makeRequest(httpClient, {
        headers,
        requestInterceptors: _requestInterceptors,
        responseInterceptors: _responseInterceptors
    })

    return {
        request,
        close: () => httpClient.close(),
        delete: async endpoint =>
            request({
                method: 'DELETE',
                path: endpoint,
                headers
            }),
        get: async endpoint =>
            request({
                method: 'GET',
                path: endpoint,
                headers
            }),
        post: async (endpoint, body) =>
            request({
                method: 'POST',
                path: endpoint,
                headers,
                body
            }),
        put: async (endpoint, body) =>
            request({
                method: 'PUT',
                path: endpoint,
                headers,
                body
            }),
        patch: async (endpoint, body) =>
            request({
                method: 'PATCH',
                path: endpoint,
                headers,
                body
            })
    }
}

module.exports = {
    httpClientFactory,
    DefaultInterceptors,
    LiscioError
}
