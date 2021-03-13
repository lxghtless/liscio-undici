const {test} = require('tap')
const sinon = require('sinon')
const {shapeUtil} = require('@lxghtless/brokkr')
const {httpClientFactory} = require('../lib')

const {isArray} = shapeUtil

const baseTestApiUrl = process.env.TEST_API_URL

test('rejects when request interceptor handler throws an error', async t => {
    const errorMessage = 'Test Error from Request Interceptor'
    const handlerStub = sinon.stub().rejects(new Error(errorMessage))
    const options = {
        baseUrl: baseTestApiUrl,
        requestInterceptors: [
            {
                name: 'unit-test-interceptor',
                handler: handlerStub
            }
        ]
    }

    const client = httpClientFactory(options)

    await t.rejects(() => client.get('/api/v1/books'), errorMessage)
    t.true(handlerStub.calledOnce)

    t.end()
})

test('handles error when request interceptor handler throws an error', async t => {
    const errorMessage = 'Test Error from Request Interceptor'
    const handlerStub = sinon.stub().rejects(new Error(errorMessage))
    const options = {
        baseUrl: baseTestApiUrl,
        requestInterceptors: [
            {
                name: 'unit-test-interceptor',
                handler: handlerStub,
                ignoreErrors: true
            }
        ],
        json: true
    }

    const client = httpClientFactory(options)

    const books = await client.get('/api/v1/books')

    await client.close()

    t.true(handlerStub.calledOnce)
    t.true(isArray(books))
    t.equal(books[0].id, '1')

    t.end()
})

test('rejects when response interceptor handler throws an error', async t => {
    const errorMessage = 'Test Error from Response Interceptor'
    const handlerStub = sinon.stub().rejects(new Error(errorMessage))
    const options = {
        baseUrl: baseTestApiUrl,
        responseInterceptors: [
            {
                name: 'unit-test-interceptor',
                handler: handlerStub
            }
        ]
    }

    const client = httpClientFactory(options)

    await t.rejects(() => client.get('/api/v1/books'), errorMessage)
    t.true(handlerStub.calledOnce)

    t.end()
})

test('handles error when response interceptor handler throws an error', async t => {
    const errorMessage = 'Test Error from Response Interceptor'
    const handlerStub = sinon.stub().rejects(new Error(errorMessage))
    const options = {
        baseUrl: baseTestApiUrl,
        responseInterceptors: [
            {
                name: 'unit-test-interceptor',
                handler: handlerStub,
                ignoreErrors: true
            }
        ],
        json: true
    }

    const client = httpClientFactory(options)

    const books = await client.get('/api/v1/books')

    await client.close()

    t.true(handlerStub.calledOnce)
    t.true(isArray(books))
    t.equal(books[0].id, '1')

    t.end()
})

test('passes config to request interceptor handler as expected', async t => {
    const config = {
        test: 'test-interceptor-config'
    }

    const handlerStub = sinon.stub()

    const options = {
        baseUrl: baseTestApiUrl,
        requestInterceptors: [
            {
                name: 'unit-test-interceptor',
                handler: handlerStub,
                config
            }
        ],
        json: true
    }

    const client = httpClientFactory(options)

    const books = await client.get('/api/v1/books')

    await client.close()

    t.same(handlerStub.firstCall.args[1], config)
    t.true(isArray(books))
    t.equal(books[0].id, '1')

    t.end()
})

test('passes config to response interceptor handler as expected', async t => {
    const config = {
        test: 'test-interceptor-config'
    }

    const handlerStub = sinon.stub()

    const options = {
        baseUrl: baseTestApiUrl,
        responseInterceptors: [
            {
                name: 'unit-test-interceptor',
                handler: handlerStub,
                config
            }
        ],
        json: true
    }

    const client = httpClientFactory(options)

    const books = await client.get('/api/v1/books')

    await client.close()

    t.same(handlerStub.firstCall.args[1], config)
    t.true(isArray(books))
    t.equal(books[0].id, '1')

    t.end()
})
