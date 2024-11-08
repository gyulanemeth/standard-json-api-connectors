import { test, expect, describe, vi } from 'vitest'

import { createPostBinaryConnector } from './index.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const testPic = fs.readFileSync(path.join(__dirname, '..', 'testPics', 'test.png'))

describe('postBinary', () => {
  global.FormData = class FormData {
    constructor () {
      this.entries = []
    }

    append (key, value) {
      this.entries.push([key, value])
    }
  }

  test('without extra headers', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({ ok: true, headers: { get: () => 'application/json' }, json: () => Promise.resolve({ result: { mocked: 'response' } }) })

    const formData = new FormData()
    formData.append('image', testPic)

    const postBinary = createPostBinaryConnector(fetch, 'https://test.com', 'image', (params) => `/v1/something/${params.somethingId}/else/`)

    const response = await postBinary({ somethingId: 3 }, testPic)
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'POST',
        headers: {},
        body: formData
      }
    ])
    expect(response).toEqual({ mocked: 'response' })
  })

  test('cors error', async () => {
    const fetch = vi.fn(() => { throw new Error('fetch error') })

    const postBinary = createPostBinaryConnector(fetch, 'https://test.com', 'image', (params) => `/v1/something/${params.somethingId}/else/`)

    await expect(postBinary({ somethingId: 3 }, testPic)).rejects.toThrowError('Failed to fetch: CORS error. Please contact support.')
  })

  test('with extra headers', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({ ok: true, headers: { get: () => 'application/json' }, json: () => Promise.resolve({ result: { mocked: 'response' } }) })

    const formData = new FormData()
    formData.append('image', testPic)

    const post = createPostBinaryConnector(fetch, 'https://test.com', 'image', params => `/v1/something/${params.somethingId}/else/`, params => ({ Authorization: 'Bearer test-token' }))

    const response = await post({ somethingId: 3 }, testPic)
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token'
        },
        body: formData
      }
    ])
    expect(response).toEqual({ mocked: 'response' })
  })

  test('text response', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({ ok: true, headers: { get: () => 'text/html' }, text: () => Promise.resolve('text response') })

    const formData = new FormData()
    formData.append('image', testPic)

    const post = createPostBinaryConnector(fetch, 'https://test.com', 'image', params => `/v1/something/${params.somethingId}/else/`, params => ({ Authorization: 'Bearer test-token' }))

    const response = await post({ somethingId: 3 }, testPic)
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token'
        },
        body: formData
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

    const formData = new FormData()
    formData.append('image', testPic)
    const post = createPostBinaryConnector(fetch, 'https://test.com', 'image', params => `/v1/something/${params.somethingId}/else/`, params => ({ Authorization: 'Bearer test-token' }), { timeout: 100 })
    await expect(post({ somethingId: 3 }, testPic)).rejects.toThrow('Failed to fetch: CORS error. Please contact support')
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

    const formData = new FormData()
    formData.append('image', testPic)
    const post = createPostBinaryConnector(fetch, 'https://test.com', 'image', params => `/v1/something/${params.somethingId}/else/`, params => ({ Authorization: 'Bearer test-token' }), { timeout: 4000 })
    const response = await post({ somethingId: 3 }, testPic)
    expect(fetch.mock.lastCall).toEqual([
      'https://test.com/v1/something/3/else/',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token'
        },
        body: formData,
        signal: expect.any(AbortSignal)
      }
    ])
    expect(response).toEqual('text response')
  })
})
