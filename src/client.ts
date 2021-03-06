import { ApiResponseError } from "./ApiResponseError";
import * as queryString from "query-string";

export interface JsonObject {[key: string]: any; }

export type RequestMethod = "GET" | "PUT" | "POST" | "DELETE";

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

export type ApiResponse<Success, Failure> = ApiSuccess<Success> | ApiFailure<Failure>;

export type ApiFailure<Failure> = ApiResponseFailure<Failure> | ApiNetworkFailure;

export interface ApiResponseFailure<Failure> {
  succeeded: false;
  responseReceived: true;
  responseError: ApiResponseError<Failure>;
}

export class Client {
  protected defaultHeaders: Headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  } as any as Headers;

  protected credentials: RequestCredentials = "same-origin";

  protected getBaseUrl(params?: Params): URL {
    const url = new window.URL(window.location.origin);
    url.search = queryString.stringify(params || {});
    return url;
  }

  protected getResponseError(response: Response): ApiResponseError<Response> {
    return new ApiResponseError(response);
  }

  public async request(
    method: RequestMethod,
    url: URL,
    headers?: Headers,
    data?: JsonObject
  ): Promise<ApiResponse<Response, JsonObject>> {
    try {
      const response = await fetch(
        url.toString(), {
          method,
          headers: headers ? headers : this.defaultHeaders,
          body: JSON.stringify(data),
          credentials: this.credentials,
        });

      if (response.ok) {
        return {
          succeeded: true,
          payload: response,
        };
      }
      return {
        succeeded: false,
        responseReceived: true,
        responseError: this.getResponseError(response),
      };
    } catch (err) {
      // tslint:disable-next-line:no-console
      window.console.error(`Api client error: ${err}`);

      return {
        succeeded: false,
        responseReceived: false,
        networkError: {
          message: err.message,
          error: err,
        },
      };
    }
  }

  private async getJsonSuccessPayloadOrDefault(
    response: Response
  ): Promise<JsonObject> {
    const defaultPayload = {};
    try {
      if (response.ok) {
        return await response.json();
      } else {
        return defaultPayload;
      }
    } catch (e) {
      return defaultPayload;
    }
  }

  protected async getAsJson(
    url: URL,
    headers?: Headers
  ): Promise<ApiResponse<JsonObject, JsonObject>> {
    const response = await this.request("GET", url, headers);

    if (response.succeeded) {
      return {
        succeeded: true,
        payload: await this.getJsonSuccessPayloadOrDefault(response.payload),
      };
    }
    return response;
  }

  protected async post(
    url: URL,
    data?: JsonObject,
    headers?: Headers
  ): Promise<ApiResponse<JsonObject, JsonObject>> {
    const response = await this.request("POST", url, headers, data);

    if (response.succeeded) {
      return {
        succeeded: true,
        payload: await this.getJsonSuccessPayloadOrDefault(response.payload),
      };
    }
    return response;
  }

  protected async put(
    url: URL,
    data?: JsonObject,
    headers?: Headers
  ): Promise<ApiResponse<JsonObject, JsonObject>> {
    const response = await this.request("PUT", url, headers, data);

    if (response.succeeded) {
      return {
        succeeded: true,
        payload: await this.getJsonSuccessPayloadOrDefault(response.payload),
      };
    }
    return response;
  }

  protected async delete(
    url: URL,
    headers?: Headers
  ) {
    const response = await this.request("DELETE", url, headers);

    if (response.succeeded) {
      return {
        succeeded: true,
        payload: null,
      };
    }
    return response as any as Promise<ApiResponse<null, JsonObject>>;
  }
}
