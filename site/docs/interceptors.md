---
id: interceptors
title: Interceptors
sidebar_label: Interceptors
---

### LiscioRequestInterceptor

> Interceptor TypeScript Definitions (shipped with library)

```typescript
import {Client} from 'undici'

export type RequestInterceptorData = {
	method: string
	path: string
	headers: Record<string, string>
	body?: Record<string, unknown> | string
}

export type ResponseInterceptorInfo<T = any> = {
	response: Client.ResponseData
	data: T
}

export interface BaseInterceptor<C = any> {
	name: string
	ignoreErrors?: boolean
	config?: C
}

export interface LiscioRequestInterceptor<C = any> extends BaseInterceptor<C> {
	handler: (requestData: RequestInterceptorData, config?: C) => void | Promise<void>
}

export interface LiscioResponseInterceptor<T = any, C = any> extends BaseInterceptor<C> {
	handler: (responseData: ResponseInterceptorInfo<T>, config?: C) => void | Promise<void>
}
```

> example with json: true

```javascript
const {httpClientFactory} = require('@lxghtless/liscio-undici')

const exampleRequestInterceptor = {
    name: 'example-request-interceptor',
    handler: requestInfo => {
        const {body, headers} = requestInfo
        // do stuff with body or headers
    },
	/*
		if set to true, errors will be caught and logged
		to enable error logs export BROKKR_LOG_LEVEL=error as an environment variable
	*/
    ignoreErrors: false
}

const options = {
	baseUrl: 'http://localhost:3000',
	// NOTE: these interceptors will be added AFTER the build in json interceptors when used with json: true
	requestInterceptors: [exampleRequestInterceptor],
	json: true
}

const client = httpClientFactory(options)
```
