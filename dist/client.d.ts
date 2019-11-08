import { ApiResponseError } from "./ApiResponseError";
export interface JsonObject {
    [key: string]: any;
}
export declare type RequestMethod = "GET" | "PUT" | "POST" | "DELETE";
export interface Params {
    [key: string]: string;
}
export interface ApiSuccess<Success> {
    succeeded: true;
    /**
     * Contains the success response of the API request. Can be null for some
     * delete requests; otherwise, the response is almost always a JSON object.
     */
    payload: Success;
}
export interface ApiNetworkFailure {
    succeeded: false;
    responseReceived: false;
    networkError: ApiNetworkError;
}
export interface ApiNetworkError {
    message: string;
    error: Error;
}
export declare type ApiResponse<Success, Failure> = ApiSuccess<Success> | ApiFailure<Failure>;
export declare type ApiFailure<Failure> = ApiResponseFailure<Failure> | ApiNetworkFailure;
export interface ApiResponseFailure<Failure> {
    succeeded: false;
    responseReceived: true;
    responseError: ApiResponseError<Failure>;
}
export declare class Client {
    protected defaultHeaders: Headers;
    protected credentials: RequestCredentials;
    protected getBaseUrl(params?: Params): URL;
    protected getResponseError(response: Response): ApiResponseError<Response>;
    request(method: RequestMethod, url: URL, headers?: Headers, data?: JsonObject): Promise<ApiResponse<Response, JsonObject>>;
    private getJsonSuccessPayloadOrDefault;
    protected getAsJson(url: URL, headers?: Headers): Promise<ApiResponse<JsonObject, JsonObject>>;
    protected post(url: URL, data?: JsonObject, headers?: Headers): Promise<ApiResponse<JsonObject, JsonObject>>;
    protected put(url: URL, data?: JsonObject, headers?: Headers): Promise<ApiResponse<JsonObject, JsonObject>>;
    protected delete(url: URL, headers?: Headers): Promise<ApiNetworkFailure | ApiResponseFailure<JsonObject> | {
        succeeded: boolean;
        payload: any;
    }>;
}
