---
id: put
title: put
sidebar_label: put
---

### client.put Raw

```javascript
const {httpClientFactory} = require('@lxghtless/liscio-undici')

const client = httpClientFactory({baseUrl: 'http://localhost:3000'})

const id = '1'
const body = 'widget 1'

// data returned as a Buffer and body treated as-is
const data = await client.put(`/widgets/${id}`, body)

// get data as utf8 string
const dataAsString = data.toString()

// close client when stopping application
await client.close()
```

### client.put JSON

```javascript
const {httpClientFactory} = require('@lxghtless/liscio-undici')

const client = httpClientFactory({
	baseUrl: 'http://localhost:3000',
	json: true
})

const id = '1'
const body = {
	name: 'widget 1'
}

// data returned as object parsed with JSON.parse and body passed through JSON.stringify
const data = await client.put(`/widgets/${id}`, body)

// close client when stopping application
await client.close()
```
