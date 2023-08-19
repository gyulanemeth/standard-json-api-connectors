import { test, expect, describe, beforeAll, vi } from 'vitest'

import {
  createGetConnector,
  createPostConnector,
  createPutConnector,
  createPatchConnector,
  createDeleteConnector
} from './index.js'

import {
  ApiError,
  /*
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  MethodNotAllowedError,
  ConflictError,
  PayloadTooLargeError,
  TooManyRequestsError, */
  InternalServerError/*,
  DatabaseConnectionError,
  NotImplementedError,
  BadGatewayError,
  ServiceUnavailableError,
  GatewayTimeoutError */
} from 'standard-api-errors'

/*
const nameLookup = {
  VALIDATION_ERROR: ValidationError,
  AUTHENTICATION_ERROR: AuthenticationError,
  AUTHORIZATION_ERROR: AuthorizationError,
  NOT_FOUND: NotFoundError,
  METHOD_NOT_ALLOWED: MethodNotAllowedError,
  CONFLICT: ConflictError,
  PAYLOAD_TOO_LARGE: PayloadTooLargeError,
  TOO_MANY_REQUESTS: TooManyRequestsError,
  INTERNAL_SERVER_ERROR: InternalServerError,
  DATABASE_CONNECTION_ERROR: DatabaseConnectionError,
  NOT_IMPLEMENTED: NotImplementedError,
  BAD_GATEWAY: BadGatewayError,
  SERVICE_UNAVAILABLE: ServiceUnavailableError,
  GATEWAY_TIMEOUT: GatewayTimeoutError
}

const statusLookup = {
  400: ValidationError,
  401: AuthenticationError,
  403: AuthorizationError,
  404: NotFoundError,
  405: MethodNotAllowedError,
  409: ConflictError,
  413: PayloadTooLargeError,
  429: TooManyRequestsError,
  500: InternalServerError,
  501: NotImplementedError,
  502: BadGatewayError,
  503: ServiceUnavailableError,
  504: GatewayTimeoutError
}

const errorStatuses = [400, 401, 403, 404, 405, 409, 413, 429, 500, 501, 502, 503, 504]
*/

describe('errors', () => {
  describe('by name - json response', () => {
    let fetch
    beforeAll(() => {
      fetch = vi.fn()
      fetch.mockResolvedValue({
        ok: false,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({
          status: 500,
          error: {
            name: 'INTERNAL_SERVER_ERROR',
            message: 'Something very bad happened.'
          }
        })
      })
    })

    test('get', async () => {
      const get = createGetConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await get({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Something very bad happened.'))
    })

    test('post', async () => {
      const post = createPostConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await post({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Something very bad happened.'))
    })

    test('put', async () => {
      const put = createPutConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await put({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Something very bad happened.'))
    })

    test('patch', async () => {
      const patch = createPatchConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await patch({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Something very bad happened.'))
    })

    test('delete', async () => {
      const del = createDeleteConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await del({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Something very bad happened.'))
    })
  })

  describe('by status - json response with error message', () => {
    let fetch
    beforeAll(() => {
      fetch = vi.fn()
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({
          status: 500,
          error: {
            message: 'Something very bad happened.'
          }
        })
      })
    })

    test('get', async () => {
      const get = createGetConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await get({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Something very bad happened.'))
    })

    test('post', async () => {
      const post = createPostConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await post({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Something very bad happened.'))
    })

    test('put', async () => {
      const put = createPutConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await put({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Something very bad happened.'))
    })

    test('patch', async () => {
      const patch = createPatchConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await patch({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Something very bad happened.'))
    })

    test('delete', async () => {
      const del = createDeleteConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await del({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Something very bad happened.'))
    })
  })

  describe('by status - json response without error message', () => {
    let fetch
    beforeAll(() => {
      fetch = vi.fn()
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({
          status: 500,
          error: {
          }
        })
      })
    })

    test('get', async () => {
      const get = createGetConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await get({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Internal Server Error'))
    })

    test('post', async () => {
      const post = createPostConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await post({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Internal Server Error'))
    })

    test('put', async () => {
      const put = createPutConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await put({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Internal Server Error'))
    })

    test('patch', async () => {
      const patch = createPatchConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await patch({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Internal Server Error'))
    })

    test('delete', async () => {
      const del = createDeleteConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await del({ somethingId: 3 })).rejects.toThrow(new InternalServerError('Internal Server Error'))
    })
  })

  describe('by status - json response, unknown status', () => {
    let fetch
    beforeAll(() => {
      fetch = vi.fn()
      fetch.mockResolvedValue({
        ok: false,
        status: 418,
        statusText: 'I\'m a teapot.',
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({})
      })
    })

    test('get', async () => {
      const get = createGetConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await get({ somethingId: 3 })).rejects.toThrow(new ApiError(418, 'I\'m a teapot.', {}))
    })

    test('post', async () => {
      const post = createPostConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await post({ somethingId: 3 })).rejects.toThrow(new ApiError(418, 'I\'m a teapot.', {}))
    })

    test('put', async () => {
      const put = createPutConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await put({ somethingId: 3 })).rejects.toThrow(new ApiError(418, 'I\'m a teapot.', {}))
    })

    test('patch', async () => {
      const patch = createPatchConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await patch({ somethingId: 3 })).rejects.toThrow(new ApiError(418, 'I\'m a teapot.', {}))
    })

    test('delete', async () => {
      const del = createDeleteConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await del({ somethingId: 3 })).rejects.toThrow(new ApiError(418, 'I\'m a teapot.', {}))
    })
  })

  describe('by status - text response, known status', () => {
    let fetch
    beforeAll(() => {
      fetch = vi.fn()
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: { get: () => 'text/html' },
        text: () => Promise.resolve('error response')
      })
    })

    test('get', async () => {
      const get = createGetConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await get({ somethingId: 3 })).rejects.toThrow(new InternalServerError('error response'))
    })

    test('post', async () => {
      const post = createPostConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await post({ somethingId: 3 })).rejects.toThrow(new InternalServerError('error response'))
    })

    test('put', async () => {
      const put = createPutConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await put({ somethingId: 3 })).rejects.toThrow(new InternalServerError('error response'))
    })

    test('patch', async () => {
      const patch = createPatchConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await patch({ somethingId: 3 })).rejects.toThrow(new InternalServerError('error response'))
    })

    test('delete', async () => {
      const del = createDeleteConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await del({ somethingId: 3 })).rejects.toThrow(new InternalServerError('error response'))
    })
  })

  describe('by status - text response, unknown status', () => {
    let fetch
    beforeAll(() => {
      fetch = vi.fn()
      fetch.mockResolvedValue({
        ok: false,
        status: 418,
        statusText: 'I\'m a teapot.',
        headers: { get: () => 'text/html' },
        text: () => Promise.resolve('error response')
      })
    })

    test('get', async () => {
      const get = createGetConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await get({ somethingId: 3 })).rejects.toThrow(new ApiError(418, 'I\'m a teapot.', 'error response'))
    })

    test('post', async () => {
      const post = createPostConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await post({ somethingId: 3 })).rejects.toThrow(new ApiError(418, 'I\'m a teapot.', 'error response'))
    })

    test('put', async () => {
      const put = createPutConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await put({ somethingId: 3 })).rejects.toThrow(new ApiError(418, 'I\'m a teapot.', 'error response'))
    })

    test('patch', async () => {
      const patch = createPatchConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await patch({ somethingId: 3 })).rejects.toThrow(new ApiError(418, 'I\'m a teapot.', 'error response'))
    })

    test('delete', async () => {
      const del = createDeleteConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

      expect(async () => await del({ somethingId: 3 })).rejects.toThrow(new ApiError(418, 'I\'m a teapot.', 'error response'))
    })
  })
})
