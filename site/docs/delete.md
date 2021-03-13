---
id: delete
title: delete
sidebar_label: delete
---

### client.delete Raw

```javascript
const {httpClientFactory} = require('@lxghtless/liscio-undici')

const client = httpClientFactory({baseUrl: 'http://localhost:3000'})

const id = '1'

// data returned as a Buffer
const data = await client.delete(`/widgets/${id}`)

// get data as utf8 string
const dataAsString = data.toString()

// close client when stopping application
await client.close()
```

### client.delete JSON

```javascript
const {httpClientFactory} = require('@lxghtless/liscio-undici')

const client = httpClientFactory({
	baseUrl: 'http://localhost:3000',
	json: true
})

const id = '1'

// data returned as object parsed with JSON.parse
const data = await client.delete(`/widgets/${id}`)

// close client when stopping application
await client.close()
```
