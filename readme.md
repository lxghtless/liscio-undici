<p align="center">
  <h2 align="center">liscio-undici</h2>
</p>

<p align="center">
	A simple
	<a href="https://github.com/nodejs/undici">
		undici
	</a>
	http client wrapper.
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
</p>

>  *Basic Example*

```ts
import {httpClientFactory} from '@lxghtless/liscio-undici'

const client = httpClientFactory({baseUrl: 'http://localhost:3000'})

const data = await client.get('/widgets')

await client.close()
```
