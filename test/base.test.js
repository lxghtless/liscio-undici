const {test} = require('tap')
const {httpClientFactory, DefaultInterceptors, LiscioError} = require('../lib')

test('base module should export expected shape', t => {
    t.ok(httpClientFactory)
    t.ok(DefaultInterceptors)
    t.ok(LiscioError)
    t.end()
})
