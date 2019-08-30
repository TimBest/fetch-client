import { ApiResponseError } from "./ApiResponseError";
import * as queryString from "query-string";

interface JsonObject {[key: string]: any; }

type RequestMethod = "GET" | "PUT" | "POST" | "DELETE";

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

type ApiResponse<Success, Failure> = ApiSuccess<Success> | ApiFailure<Failure>;

type ApiFailure<Failure> = ApiResponseFailure<Failure> | ApiNetworkFailure;

interface ApiResponseFailure<Failure> {
  succeeded: false;
  responseReceived: true;
  responseError: ApiResponseError<Failure>;
}

class ApiClient {
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
        responseError: new ApiResponseError(response),
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

export default ApiClient;
