import { test, expect, describe, vi } from 'vitest'

import { createDeleteConnector } from './index.js'

describe('delete', () => {
  test('without extra headers', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({ ok: true, headers: { get: () => 'application/json' }, json: () => Promise.resolve({ result: { mocked: 'response' } }) })

    const del = createDeleteConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

    let response = await del({ somethingId: 3 })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      }
    ])
    expect(response).toEqual({ mocked: 'response' })

    response = await del({ somethingId: 10 })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/10/else/',
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      }
    ])
    expect(response).toEqual({ mocked: 'response' })
  })

  test('cors error', async () => {
    const fetch = vi.fn(() => { throw new Error('fetch error') })

    const del = createDeleteConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

    await expect(del({ somethingId: 3 })).rejects.toThrowError('Failed to fetch: CORS error. Please contact support.')
  })

  test('with extra headers', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({ ok: true, headers: { get: () => 'application/json' }, json: () => Promise.resolve({ result: { mocked: 'response' } }) })

    const del = createDeleteConnector(fetch, 'https://test.com', params => `/v1/something/${params.somethingId}/else/`, params => ({ Authorization: 'Bearer test-token' }))

    let response = await del({ somethingId: 3 })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token'
        }
      }
    ])
    expect(response).toEqual({ mocked: 'response' })

    response = await del({ somethingId: 10 })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/10/else/',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token'
        }
      }
    ])
    expect(response).toEqual({ mocked: 'response' })
  })

  test('text response', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({ ok: true, headers: { get: () => 'text/html' }, text: () => Promise.resolve('text response') })

    const del = createDeleteConnector(fetch, 'https://test.com', params => `/v1/something/${params.somethingId}/else/`, params => ({ Authorization: 'Bearer test-token' }))

    const response = await del({ somethingId: 3 })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token'
        }
      }
    ])
    expect(response).toEqual('text response')
  })

  test('with signal', async () => {
    const fetch = vi.fn((url, options) => {
      return new Promise((resolve, reject) => {
        if (options.signal.aborted) {
          reject(new Error('Aborted'))
        } else {
          setTimeout(() => resolve({
            ok: true,
            headers: { get: () => 'text/html' },
            text: () => Promise.resolve('text response')
          }), 3000)
        }

        options.signal.addEventListener('abort', () => reject(new Error('Aborted')))
      })
    })
    const del = createDeleteConnector(fetch, 'https://test.com', params => `/v1/something/${params.somethingId}/else/`, params => ({ Authorization: 'Bearer test-token' }), { signal: 100 })

    await expect(del({ somethingId: 3 })).rejects.toThrow('Failed to fetch: CORS error. Please contact support')
  })
})
