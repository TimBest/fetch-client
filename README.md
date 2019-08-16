# fetch-client

[![CircleCI](https://circleci.com/gh/TimBest/fetch-client.svg?style=svg)](https://circleci.com/gh/TimBest/fetch-client)


## Example

### Configure API
`ClientBase.ts`
```ts
import { FetchClient, getDocumentCsrfToken} from "fetch-client";

class ClientBase extends FetchClient {
  constructor() {
    this.defaultHeaders["X-CSRF-Token"] = getDocumentCsrfToken()
  }
}

export default ClientBase
```

### Define an Endpoint
`FooAPIClient.d.ts`
```ts
Foo {
  bar: string;
}

FooCreateResponse {
  id: string;
}
```

`FoosAPIClient.ts`
```ts
import ClientBase from "./ClientBase";

class FoosAPIClient extends ClientBase {
  public getUrl(fooId?: string): URL {
    const fooUrl = this.getBaseUrl();

    if (fooId !== undefined) {
      fooId.pathname += `foos/${fooId}`;
    } else {
      fooId.pathname += "foos";
    }

    return fooUrl;
  }

  public async create(foo: Foo) {
    return await this.post(this.getUrl(), foo) as ApiResponse<FooCreateResponse, JsonObject>;
  }

  public async updateBar(fooId: string, bar: string) {
    const url = this.getUrl(fooId);
    return await this.put(url, {
      bar: bar,
    });
  }

  public async destroy(fooId: string) {
    const url = this.getUrl(fooId);
    return await this.delete(url);
  }
}

export default FoosAPIClient
```

### Register Endpoint

`RestAPIClient.ts`
```ts
import FoosAPIClient from "./FoosAPIClient"

class RestAPIClient {
    private static foosClient: FoosAPIClient;

  public static get foos() {
    if (!DashboardApi.foosClient) {
      DashboardApi.foosClient = new FoosAPIClient();
    }
    return DashboardApi.foosClient;
  }
}

export default RestAPIClient
```

### Use API
`script.ts`
```ts
import RestAPIClient from "./RestAPIClient"

async function createFoo(foo: Foo) {
  const response = await RestAPIClient.foos.create(foo);
  if (response.succeeded) {
    alert(`Created foo with id: ${response.payload.id}`)
  } else {
   if (response.responseReceived) {
      const errorJson = await response.responseError.getJson();
      console.error(errorJson);
    } else {
      console.error("Unable to create Foo");
    }
  }
}

createFoo({bar: 1})
```