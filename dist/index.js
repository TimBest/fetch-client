'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ExtendableError = _interopDefault(require('es6-error'));
var queryString = require('query-string');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/**
 * Represents the error response of an API request.
 *
 */
class ApiResponseError extends ExtendableError {
    constructor(response) {
        super(`The API response returned a ${response.status} status code.`);
        this._response = response;
    }
    get response() {
        return this._response;
    }
    getJson() {
        return this.response.json();
    }
}

class Client {
    constructor() {
        this.defaultHeaders = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        this.credentials = "same-origin";
    }
    getBaseUrl(params) {
        const url = new window.URL(window.location.origin);
        url.search = queryString.stringify(params || {});
        return url;
    }
    request(method, url, headers, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(url.toString(), {
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
            }
            catch (err) {
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
        });
    }
    getJsonSuccessPayloadOrDefault(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultPayload = {};
            try {
                if (response.ok) {
                    return yield response.json();
                }
                else {
                    return defaultPayload;
                }
            }
            catch (e) {
                return defaultPayload;
            }
        });
    }
    getAsJson(url, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.request("GET", url, headers);
            if (response.succeeded) {
                return {
                    succeeded: true,
                    payload: yield this.getJsonSuccessPayloadOrDefault(response.payload),
                };
            }
            return response;
        });
    }
    post(url, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.request("POST", url, headers, data);
            if (response.succeeded) {
                return {
                    succeeded: true,
                    payload: yield this.getJsonSuccessPayloadOrDefault(response.payload),
                };
            }
            return response;
        });
    }
    put(url, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.request("PUT", url, headers, data);
            if (response.succeeded) {
                return {
                    succeeded: true,
                    payload: yield this.getJsonSuccessPayloadOrDefault(response.payload),
                };
            }
            return response;
        });
    }
    delete(url, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.request("DELETE", url, headers);
            if (response.succeeded) {
                return {
                    succeeded: true,
                    payload: null,
                };
            }
            return response;
        });
    }
}

var client = /*#__PURE__*/Object.freeze({
    Client: Client
});

function getDocumentCsrfToken() {
    return document.querySelectorAll('meta[name="csrf-token"]')[0].content;
}

exports.ApiResponseError = ApiResponseError;
exports.FetchClient = client;
exports.getDocumentCsrfToken = getDocumentCsrfToken;
