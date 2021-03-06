const {test} = require('tap')
const {httpClientFactory, DefaultInterceptors} = require('../lib')
const {shapeUtil} = require('@lxghtless/brokkr')

const {isArray, isString} = shapeUtil

const baseTestApiUrl = process.env.TEST_API_URL

test('get raw data as is', async t => {
    const options = {
        baseUrl: 'https://raw.githubusercontent.com',
        responseInterceptors: [
            DefaultInterceptors.JsonParserResponseInterceptor
        ]
    }

    const client = httpClientFactory(options)

    const pkg = await client.get('/lxghtless/mode-mask/master/package.json')

    await client.close()

    const pkgJson = JSON.parse(pkg.toString())

    t.equal(pkgJson.name, 'mode-mask')

    t.end()
})

test('get json data as json', async t => {
    const options = {
        baseUrl: baseTestApiUrl,
        json: true
    }

    const client = httpClientFactory(options)

    const books = await client.get('/api/v1/books')

    await client.close()

    t.true(isArray(books))
    t.equal(books[0].id, '1')

    t.end()
})

test('post json data as json', async t => {
    const options = {
        baseUrl: baseTestApiUrl,
        json: true
    }

    const client = httpClientFactory(options)

    const book = await client.post('/api/v1/books', {
        publishedAt: new Date().toISOString(),
        author: `Test Stamp-${Date.now()}`,
        title: 'A Test'
    })

    await client.close()

    t.true(isString(book.id))
    t.equal(book.title, 'A Test')

    t.end()
})

test('put json data as json', async t => {
    const options = {
        baseUrl: baseTestApiUrl,
        json: true
    }

    const bookId = '3'
    const bookPublishedAt = new Date().toISOString()
    const bookAuthor = `Test Stamp-${Date.now()}`
    const bookTitle = 'A PUT Test'

    const client = httpClientFactory(options)

    const book = await client.put(`/api/v1/books/${bookId}`, {
        publishedAt: bookPublishedAt,
        author: bookAuthor,
        title: bookTitle
    })

    await client.close()

    t.true(isString(book.id))
    t.is(book.id, bookId)
    t.is(book.publishedAt, bookPublishedAt)
    t.is(book.author, bookAuthor)
    t.equal(book.title, bookTitle)

    t.end()
})
