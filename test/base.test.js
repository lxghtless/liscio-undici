const {test} = require('tap')
const {httpClientFactory} = require('../lib')

test('base module should export expected shape', t => {
    t.ok(httpClientFactory)
    t.end()
})

test('basic httpClientFactory usage should successfully get data', async t => {
    const options = {
        baseUrl: 'https://raw.githubusercontent.com'
    }

    const client = httpClientFactory(options)

    const pkg = await client.get(
        '/lxghtless/mode-mask/master/package.json',
        true
    )

    await client.close()

    t.true(pkg.name === 'mode-mask')

    t.end()
})
