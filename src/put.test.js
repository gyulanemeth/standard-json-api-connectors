import { test, expect, describe, vi } from 'vitest'

import { createPutConnector } from './index.js'

describe('put', () => {
  test('without extra headers', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({ ok: true, headers: { get: () => 'application/json' }, json: () => Promise.resolve({ result: { mocked: 'response' } }) })

    const put = createPutConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

    let response = await put({ somethingId: 3 }, { example: 'body' })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ example: 'body' })
      }
    ])
    expect(response).toEqual({ mocked: 'response' })

    response = await put({ somethingId: 10 }, { example: 'body 2' })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/10/else/',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ example: 'body 2' })
      }
    ])
    expect(response).toEqual({ mocked: 'response' })
  })

  test('cors error', async () => {
    const fetch = vi.fn(() => { throw new Error('fetch error') })

    const put = createPutConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

    await expect(put({ somethingId: 3 }, { example: 'body' })).rejects.toThrowError('Failed to fetch: CORS error. Please contact support.')
  })

  test('with extra headers', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({ ok: true, headers: { get: () => 'application/json' }, json: () => Promise.resolve({ result: { mocked: 'response' } }) })

    const put = createPutConnector(fetch, 'https://test.com', params => `/v1/something/${params.somethingId}/else/`, params => ({ Authorization: 'Bearer test-token' }))

    let response = await put({ somethingId: 3 }, { example: 'body' })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token'
        },
        body: JSON.stringify({ example: 'body' })
      }
    ])
    expect(response).toEqual({ mocked: 'response' })

    response = await put({ somethingId: 10 }, { example: 'body 2' })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/10/else/',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token'
        },
        body: JSON.stringify({ example: 'body 2' })
      }
    ])
    expect(response).toEqual({ mocked: 'response' })
  })

  test('text response', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({ ok: true, headers: { get: () => 'text/html' }, text: () => Promise.resolve('text response') })

    const put = createPutConnector(fetch, 'https://test.com', params => `/v1/something/${params.somethingId}/else/`, params => ({ Authorization: 'Bearer test-token' }))

    const response = await put({ somethingId: 3 }, { example: 'body' })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token'
        },
        body: JSON.stringify({ example: 'body' })
      }
    ])
    expect(response).toEqual('text response')
  })

  test('with timeout', async () => {
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

    const put = createPutConnector(fetch, 'https://test.com', params => `/v1/something/${params.somethingId}/else/`, params => ({ Authorization: 'Bearer test-token' }), { timeout: 100 })
    await expect(put({ somethingId: 3 }, { example: 'body' })).rejects.toThrow('Failed to fetch: CORS error. Please contact support')
  })

  test('success with timeout', async () => {
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

    const put = createPutConnector(fetch, 'https://test.com', params => `/v1/something/${params.somethingId}/else/`, params => ({ Authorization: 'Bearer test-token' }), { timeout: 4000 })
    const response = await put({ somethingId: 3 }, { example: 'body' })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token'
        },
        body: JSON.stringify({ example: 'body' }),
        signal: expect.any(AbortSignal)
      }
    ])
    expect(response).toEqual('text response')
  })
})
