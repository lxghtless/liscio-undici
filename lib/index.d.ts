import {Client, Dispatcher} from 'undici'

export interface LiscioClient {
	request<T = any>(options: any): Promise<T>
	close(): Promise<void>
	delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T>
	get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T>
	patch<T = any, P = any>(endpoint: string, payload: P, headers?: Record<string, string>): Promise<T>
	post<T = any, P = any>(endpoint: string, payload: P, headers?: Record<string, string>): Promise<T>
	put<T = any, P = any>(endpoint: string, payload: P, headers?: Record<string, string>): Promise<T>
}

export type RequestInterceptorData = {
	method: string
	path: string
	headers: Record<string, string>
	body?: Record<string, unknown> | string
}

export type ResponseInterceptorInfo<T = any> = {
	response: Dispatcher.ResponseData
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

export type LiscioClientOptions = {
	baseUrl?: string
	userAgent?: string
	requestInterceptors?: LiscioRequestInterceptor[]
	responseInterceptors?: LiscioResponseInterceptor[]
	undiciOptions?: Client.Options
	json?: boolean
	client?: Client
	/*
		Default: 299
	*/
	maxStatusCode?: number,
	disableRejectGtMaxStatusCode?: boolean
}

/**
 * Create a new LiscioClient with the provided options
 *
 * @param  {LiscioClientOptions} options
 * @returns LiscioClient
 */
export function httpClientFactory(options: LiscioClientOptions): LiscioClient

export declare class LiscioError extends Error {
	errorResponse: string
	message: string
	name: string
	status: string
	statusCode: number

	/**
	 * @param  {string} message The liscio-undici provided error message
	 * @param  {number} statusCode The status code provided by undici Client.ResponseData
	 * @param  {string} errorResponse The error response body decoded to a string
	 */
	constructor(message: string, statusCode: number, errorResponse: string)
}

export declare const DefaultInterceptors: {
	JsonParserResponseInterceptor: LiscioResponseInterceptor
	JsonStringifyRequestInterceptor: LiscioRequestInterceptor
}
