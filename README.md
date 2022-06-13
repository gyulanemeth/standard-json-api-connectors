# standard-json-api-connectors

Standardized HTTP JSON requests with standardized errors, which assumes the following response format from the server:

In case of successful requests:
```json
{
  "status": 200,
  "result": {
    "something": "here"
  }
}
```

In case of errors:
```json
{
  "status": 500,
  "error": {
    "name": "name of the error",
    "message": "details about the error"
  }
}
```

Whenewer the response is in the HTTP 400-599 range, an error is thrown based on [standard-api-errors](https://www.npmjs.com/package/standard-api-errors).

The lib also works with non-JSON error repsonses, then the status comes from the HTTP status code, the name of the error will be the HTTP status text and the message will be the respone's body.

## Usage

```javascript
import {
  createGetConnector,
  createPostConnector,
  createPutConnector,
  createPatchConnector,
  createDeleteConnector
} from 'standard-json-api-connectors'

const apiUrl = 'https://example-api.com/'
const generateRoute = (params) => {
  return `/v1/user/${params.userId}/projects/${params.id ? params.id : ''}`
}
const generateAdditionalHeaders = (params) => {
  return { Authorization: 'Bearer mybearertoken' }
}

const get = createGetConnector(fetch, apiUrl, generateRoute, generateAdditionalHeaders)
const post = createPostConnector(fetch, apiUrl, generateRoute, generateAdditionalHeaders)
const put = createPutConnector(fetch, apiUrl, generateRoute, generateAdditionalHeaders)
const patch = createPatchConnector(fetch, apiUrl, generateRoute, generateAdditionalHeaders)
const del = createDeleteConnector(fetch, apiUrl, generateRoute, generateAdditionalHeaders)

// after this, you can invoke the returned functions
```

All of the creator functions have the following parameters:
 - **fetch**: A reference to a [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) compatible function.
 - **apiUrl**: The root URL of your API. The route will be concatenated to this.
 - **generateRoute**: This function has to generate route based on the `params` object it gets as an argument.
 - **generateAdditionalHeaders**: By default, "Content-Type": "application/json" header is added to every request. With this callback, you can add extra headers to the request, for example an authorization header. You can generate different headers based on the `params` object it gets as an argument.

## get

```javascript
const result = await get({ userId: 2 }, { find: { name: 'awesome' }, skip: 10, limit: 5 })
// GET https://example-api.com/v1/users/2/projects/?find[name]=awesome&skip=10&limit=5
```

Parameters:
 - **params**: an object representing the parameters that will be used in the route.
 - **query**: an object representing the query string

## post

```javascript
const result = await post({ userId: 2 }, { name: 'new project' })
// POST https://example-api.com/v1/users/2/projects/
```

Parameters:
 - **params**: an object representing the parameters that will be used in the route.
 - **body**: an object representing the body of the request

## put

```javascript
const result = await put({ userId: 2 }, { name: 'updated project' })
// PUT https://example-api.com/v1/users/2/projects/
```

Parameters:
 - **params**: an object representing the parameters that will be used in the route.
 - **body**: an object representing the body of the request

## patch

```javascript
const result = await patch({ userId: 2 }, { name: 'updated project' })
// PATCH https://example-api.com/v1/users/2/projects/
```

Parameters:
 - **params**: an object representing the parameters that will be used in the route.
 - **body**: an object representing the body of the request

## delete

```javascript
const result = await del({ userId: 2 })
// DELETE https://example-api.com/v1/users/2/projects/
```

Parameters:
 - **params**: an object representing the parameters that will be used in the route.
