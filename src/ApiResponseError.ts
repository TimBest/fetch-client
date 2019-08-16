import ExtendableError from "es6-error";
/**
 * Represents the error response of an API request.
 *
 */
export class ApiResponseError<T> extends ExtendableError {

  private _response: Response;

  constructor(response: Response) {
    super(`The API response returned a ${response.status} status code.`);
    this._response = response;
  }

  public get response() {
    return this._response;
  }

  public getJson(): Promise<T> {
    return this.response.json();
  }

}
