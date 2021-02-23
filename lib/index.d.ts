export interface LiscioClient {
	request<T = any>(options: any): Promise<T>
	close(): Promise<void>
	delete<T = any>(endpoint: string): Promise<T>
	get<T = any>(endpoint: string): Promise<T>
	patch<T = any, P = any>(endpoint: string, payload: P): Promise<T>
	post<T = any, P = any>(endpoint: string, payload: P): Promise<T>
	put<T = any, P = any>(endpoint: string, payload: P): Promise<T>
}

export interface LiscioInterceptor {
	name: string
	handler(): () => void | Promise<void>
	config: any
}

export type LiscioClientOptions = {
	baseUrl: string
	userAgent?: string
	requestInterceptors?: LiscioInterceptor[]
	responseInterceptors?: LiscioInterceptor[]
	undiciOptions?: any
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
