---
id: options
title: options
sidebar_label: options
---

### LiscioClientOptions

> LiscioClientOptions TypeScript Definition (shipped with library)

```typescript
import {Client} from 'undici'

export type LiscioClientOptions = {
	baseUrl: string
	userAgent?: string
	requestInterceptors?: LiscioRequestInterceptor[]
	responseInterceptors?: LiscioResponseInterceptor[]
	undiciOptions?: Client.Options
	json?: boolean
}
```

For more details on interceptors, see [interceptors docs](interceptors)

> basic json example

```javascript
const {httpClientFactory} = require('@lxghtless/liscio-undici')

const options = {
	baseUrl: 'http://localhost:3000',
	json: true
}

const client = httpClientFactory(options)
```
