import { jest } from '@jest/globals'

import { createGetConnector } from './index.js'

describe('GET', () => {
  test('without extra headers', async () => {
    const fetch = jest.fn()
    fetch.mockResolvedValue({ ok: true, headers: { get: () => 'application/json' }, json: () => Promise.resolve({ result: { mocked: 'response' } }) })

    const get = createGetConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

    let response = await get({ somethingId: 3 })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    ])
    expect(response).toEqual({ mocked: 'response' })

    response = await get({ somethingId: 10 }, { filter: { name: 'test name' }, skip: 10, limit: 10 })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/10/else/?filter[name]=test%20name&skip=10&limit=10',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    ])
    expect(response).toEqual({ mocked: 'response' })
  })

  test('cors error', async () => {
    const fetch = jest.fn(() => { throw new Error('fetch error') })

    const get = createGetConnector(fetch, 'https://test.com', (params) => `/v1/something/${params.somethingId}/else/`)

    await expect(get({ somethingId: 3 })).rejects.toThrowError('Failed to fetch: CORS error. Please contact support.')
  })

  test('with extra headers', async () => {
    const fetch = jest.fn()
    fetch.mockResolvedValue({ ok: true, headers: { get: () => 'application/json' }, json: () => Promise.resolve({ result: { mocked: 'response' } }) })

    const get = createGetConnector(fetch, 'https://test.com', params => `/v1/something/${params.somethingId}/else/`, params => ({ Authorization: 'Bearer test-token' }))

    let response = await get({ somethingId: 3 })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token'
        }
      }
    ])
    expect(response).toEqual({ mocked: 'response' })

    response = await get({ somethingId: 10 }, { filter: { name: 'test name' }, skip: 10, limit: 10 })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/10/else/?filter[name]=test%20name&skip=10&limit=10',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token'
        }
      }
    ])
    expect(response).toEqual({ mocked: 'response' })
  })

  test('text response', async () => {
    const fetch = jest.fn()
    fetch.mockResolvedValue({ ok: true, headers: { get: () => 'text/html' }, text: () => Promise.resolve('text response') })

    const get = createGetConnector(fetch, 'https://test.com', params => `/v1/something/${params.somethingId}/else/`, params => ({ Authorization: 'Bearer test-token' }))

    const response = await get({ somethingId: 3 })
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token'
        }
      }
    ])
    expect(response).toEqual('text response')
  })
})
