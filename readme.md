<p align="center">
  <h2 align="center">liscio-undici</h2>
</p>

<p align="center">
	A simple
	<a href="https://github.com/nodejs/undici">
		undici
	</a>
	http client wrapper with interceptors.
</p>

<p align="center">
	<a href="https://www.npmjs.com/package/@lxghtless/liscio-undici">
		<img src="https://img.shields.io/npm/v/@lxghtless/liscio-undici?color=blue" />
	</a>
	<a href="https://www.typescriptlang.org/">
		<img src="https://aleen42.github.io/badges/src/javascript.svg" />
	</a>
	<a href="https://eslint.org/">
		<img src="https://aleen42.github.io/badges/src/eslint.svg" />
	</a>
	<a href="https://codecov.io/gh/lxghtless/liscio-undici">
		<img src="https://codecov.io/gh/lxghtless/liscio-undici/branch/main/graph/badge.svg?token=T7N6UWP035"/>
	</a>
</p>

>  *Basic Example*

```ts
import {httpClientFactory} from '@lxghtless/liscio-undici'

const client = httpClientFactory({baseUrl: 'http://localhost:3000'})

const data = await client.get('/widgets')

await client.close()
```

>  *JSON Example*

```ts
import {httpClientFactory} from '@lxghtless/liscio-undici'

const client = httpClientFactory({baseUrl: 'http://localhost:3000', json: true})

// data will be parsed json if data is returned and the content-type header starts with application/json
const data = await client.get('/widgets')

// body parameter will be stringified and a application/json content-type header will be added
await client.post('/widgets', {
	name: 'Example Widget'
})

await client.close()
```


>  *With response interceptor Example*

```ts
import {httpClientFactory, JsonParserResponseInterceptor} from '@lxghtless/liscio-undici'

const client = httpClientFactory({
	baseUrl: 'http://localhost:3000',
	// response interceptors are executed in array order
	responseInterceptors: [{
		name: 'log-reponse-interceptor',
		// supports async / promise handlers
		handler: response => {
			const {response, data} = response
			console.log(response.headers['X-EXAMPLE-TRACE-ID'])
			// data is a buffer from the undici reponse body
			const strData = data.toString()
			// do stuff with strData
		}
	}]
})

const data = await client.get('/widgets')

await client.close()
```


>  *With request interceptor Example*

```ts
import {httpClientFactory} from '@lxghtless/liscio-undici'

const client = httpClientFactory({
	baseUrl: 'http://localhost:3000',
	// request interceptors are executed in array order
	requestInterceptors: [{
		name: 'set-header-interceptor',
		// supports async / promise handlers
		handler: request => {
			// also {body} can be destructured
			const {headers} = request
			headers['X-EXAMPLE-TIMESTAMP'] = Date.now().toString()
		}
	}]
})

const data = await client.get('/widgets')

await client.close()
```
