export interface LiscioClient {
	close(): Promise<void>
	delete<T = any>(endpoint: string, asJson?: boolean): Promise<T>
	get<T = any>(endpoint: string, asJson?: boolean): Promise<T>
	patch<T = any, P = any>(endpoint: string, payload: P, asJson?: boolean): Promise<T>
	post<T = any, P = any>(endpoint: string, payload: P, asJson?: boolean): Promise<T>
	put<T = any, P = any>(endpoint: string, payload: P, asJson?: boolean): Promise<T>
}

export type LiscioClientOptions = {
	baseUrl: string
	userAgent?: string
	autoParseJson?: boolean
	resolveAuthHeader?(): Promise<string>
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
