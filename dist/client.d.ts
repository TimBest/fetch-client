import { ApiResponseError } from "./ApiResponseError";
interface JsonObject {
    [key: string]: any;
}
declare type RequestMethod = "GET" | "PUT" | "POST" | "DELETE";
interface Params {
    [key: string]: string;
}
interface ApiSuccess<Success> {
    succeeded: true;
    /**
     * Contains the success response of the API request. Can be null for some
     * delete requests; otherwise, the response is almost always a JSON object.
     */
    payload: Success;
}
interface ApiNetworkFailure {
    succeeded: false;
    responseReceived: false;
    networkError: ApiNetworkError;
}
interface ApiNetworkError {
    message: string;
    error: Error;
}
declare type ApiResponse<Success, Failure> = ApiSuccess<Success> | ApiFailure<Failure>;
declare type ApiFailure<Failure> = ApiResponseFailure<Failure> | ApiNetworkFailure;
interface ApiResponseFailure<Failure> {
    succeeded: false;
    responseReceived: true;
    responseError: ApiResponseError<Failure>;
}
declare class ApiClient {
    protected defaultHeaders: Headers;
    protected credentials: RequestCredentials;
    protected getBaseUrl(params?: Params): URL;
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
export default ApiClient;
