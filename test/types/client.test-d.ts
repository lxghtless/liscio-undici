import {expectAssignable} from 'tsd'
import {httpClientFactory, LiscioClient} from '../../lib'

expectAssignable<LiscioClient>(httpClientFactory({
	baseUrl: 'http://types-test'
}))
