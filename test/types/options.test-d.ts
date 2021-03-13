import {expectAssignable} from 'tsd'
import {LiscioClientOptions} from '../../lib'

expectAssignable<LiscioClientOptions>({
	baseUrl: 'http://types-test'
})

expectAssignable<LiscioClientOptions>({
	baseUrl: 'http://types-test',
	userAgent: 'types-test',
	json: true
})
