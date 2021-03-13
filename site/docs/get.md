---
id: get
title: get
sidebar_label: get
---

### client.get Raw

```javascript
const {httpClientFactory} = require('@lxghtless/liscio-undici')

const client = httpClientFactory({baseUrl: 'http://localhost:3000'})

// data returned as a Buffer
const data = await client.get('/widgets')

// get data as utf8 string
const dataAsString = data.toString()

// close client when stopping application
await client.close()
```

### client.get JSON

```javascript
const {httpClientFactory} = require('@lxghtless/liscio-undici')

const client = httpClientFactory({
	baseUrl: 'http://localhost:3000',
	json: true
})

// data returned as object parsed with JSON.parse
const data = await client.get('/widgets')

// close client when stopping application
await client.close()
```
