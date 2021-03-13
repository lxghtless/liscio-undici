import {Client} from 'undici'

export interface LiscioClient {
	request<T = any>(options: any): Promise<T>
	close(): Promise<void>
	delete<T = any>(endpoint: string): Promise<T>
	get<T = any>(endpoint: string): Promise<T>
	patch<T = any, P = any>(endpoint: string, payload: P): Promise<T>
	post<T = any, P = any>(endpoint: string, payload: P): Promise<T>
	put<T = any, P = any>(endpoint: string, payload: P): Promise<T>
}

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

export interface LiscioRequestInterceptor<C = any> {
	name: string
	handler: (requestData: RequestInterceptorData, config?: C) => void | Promise<void>
	config?: C
}

export interface LiscioResponseInterceptor<T = any, C = any> {
	name: string
	handler: (responseData: ResponseInterceptorInfo<T>, config?: C) => void | Promise<void>
	config?: C
}

export type LiscioClientOptions = {
	baseUrl: string
	userAgent?: string
	requestInterceptors?: LiscioRequestInterceptor[]
	responseInterceptors?: LiscioResponseInterceptor[]
	undiciOptions?: any
	json?: boolean
}

export function httpClientFactory(options: LiscioClientOptions): LiscioClient

export declare class LiscioError extends Error {
	errorResponse: string;
	message: string;
	name: string;
	status: string;
	statusCode: number;

	constructor(message: string, statusCode: number, errorResponse: string);
}
