import {expectAssignable} from 'tsd'
import {LiscioError} from '../../lib'

expectAssignable<LiscioError>(
	new LiscioError('type test error', 400, 'bad response')
)
