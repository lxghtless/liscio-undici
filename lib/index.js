const {STATUS_CODES} = require('http')
const undici = require('undici')

class LiscioError extends Error {
    constructor(message, statusCode, errorResponse) {
        super(message)
        this.name = 'LiscioError'
        this.statusCode = statusCode
        this.status = STATUS_CODES[this.statusCode]
        this.errorResponse = errorResponse
    }
}

const httpClient = (baseUrl, undiciOptions) =>
    new undici.Client(baseUrl, undiciOptions)

const isNil = value => value === null || value === undefined

const contentTypeJson = 'application/json; charset=utf-8'

const applicationJson = {
    'content-type': contentTypeJson
}

const hasJsonContent = headers =>
    headers['content-type'] &&
    (headers['content-type'] === contentTypeJson ||
        headers['content-type'].startsWith(contentTypeJson.split(';')[0]))

const httpClientFactory = ({
    baseUrl,
    resolveAuthHeader,
    userAgent,
    autoParseJson,
    undiciOptions
}) => ({
    client: httpClient(baseUrl, undiciOptions),
    async close() {
        await this.client.close()
    },
    headers: null,
    async clientHeaders(asJson) {
        if (isNil(this.headers)) {
            this.headers = {
                'authorization': resolveAuthHeader
                    ? await resolveAuthHeader()
                    : undefined,
                'user-agent': userAgent || 'liscio-undici'
            }
        }

        if (asJson) {
            Object.assign(this.headers, applicationJson)
        }

        return this.headers
    },
    async processResponse(response, asJson) {
        const {statusCode, headers, body} = response

        const chunks = []

        for await (const chunk of body) {
            chunks.push(chunk)
        }

        const responseData = Buffer.concat(chunks)

        if (statusCode > 299) {
            return Promise.reject(
                new LiscioError(
                    'Unexpected statusCode',
                    statusCode,
                    responseData.toString()
                )
            )
        }

        if (
            responseData &&
            ((autoParseJson && hasJsonContent(headers)) || asJson)
        ) {
            try {
                return JSON.parse(responseData)
            } catch (_) {
                return responseData
            }
        }

        return responseData
    },
    async delete(endpoint, asJson) {
        return this.processResponse(
            await this.client.request({
                method: 'DELETE',
                path: endpoint,
                headers: await this.clientHeaders()
            }),
            asJson
        )
    },
    async get(endpoint, asJson) {
        return this.processResponse(
            await this.client.request({
                method: 'GET',
                path: endpoint,
                headers: await this.clientHeaders()
            }),
            asJson
        )
    },
    async patch(endpoint, payload, asJson) {
        return this.processResponse(
            await this.client.request({
                method: 'PATCH',
                path: endpoint,
                headers: await this.clientHeaders(asJson),
                body: payload
            }),
            asJson
        )
    },
    async post(endpoint, payload, asJson) {
        return this.processResponse(
            await this.client.request({
                method: 'POST',
                path: endpoint,
                headers: await this.clientHeaders(asJson),
                body: payload
            }),
            asJson
        )
    },
    async put(endpoint, payload, asJson) {
        return this.processResponse(
            await this.client.request({
                method: 'PUT',
                path: endpoint,
                headers: await this.clientHeaders(asJson),
                body: payload
            }),
            asJson
        )
    }
})

module.exports = {
    httpClientFactory,
    LiscioError
}
