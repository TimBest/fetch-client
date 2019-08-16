import ExtendableError from "es6-error";
/**
 * Represents the error response of an API request.
 *
 */
export declare class ApiResponseError<T> extends ExtendableError {
    private _response;
    constructor(response: Response);
    readonly response: Response;
    getJson(): Promise<T>;
}
