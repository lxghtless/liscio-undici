import {expectAssignable} from 'tsd'
import {LiscioRequestInterceptor, LiscioResponseInterceptor, DefaultInterceptors} from '../../lib'

expectAssignable<LiscioRequestInterceptor>(DefaultInterceptors.JsonStringifyRequestInterceptor)
expectAssignable<LiscioResponseInterceptor>(DefaultInterceptors.JsonParserResponseInterceptor)
