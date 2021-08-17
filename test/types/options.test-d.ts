import {expectAssignable} from 'tsd'
import {LiscioClientOptions} from '../../lib'
import {MockClient, MockAgent} from 'undici'

expectAssignable<LiscioClientOptions>({
	baseUrl: 'http://types-test'
})

expectAssignable<LiscioClientOptions>({
	baseUrl: 'http://types-test',
	userAgent: 'types-test',
	json: true
})

// test ability to inject a mock client
const client = new MockClient('http://localhost:3000', {
	agent: new MockAgent({connections: 1})
})

expectAssignable<LiscioClientOptions>({
	client,
	json: true
})
