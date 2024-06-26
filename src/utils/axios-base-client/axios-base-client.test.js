'use strict'

const nock = require('nock')
const { Client } = require('./axios-base-client')

const baseUrl = 'http://localhost:8000'
const app = 'an-app'

describe('Axios base client', () => {
  const requestStartSpy = jest.fn()
  const requestSuccessSpy = jest.fn()
  const requestFailureSpy = jest.fn()
  const client = new Client(app)

  beforeEach(() => {
    requestStartSpy.mockClear()
    requestFailureSpy.mockClear()
    requestSuccessSpy.mockClear()
  })

  describe('Response and hooks when acceptAllStatusCodes is not set', () => {
    beforeAll(() => {
      client.configure(baseUrl, {
        onRequestStart: requestStartSpy,
        onSuccessResponse: requestSuccessSpy,
        onFailureResponse: requestFailureSpy
      })
    })

    it('should return response and call hook on 200 response', async () => {
      const body = { foo: 'bar' }
      nock(baseUrl)
        .get('/')
        .reply(200, body)

      const response = await client.get('/', 'doing something', {
        additionalLoggingFields: { foo: 'bar' }
      })

      expect(response.data).toEqual(body)

      expect(requestStartSpy.mock.calls[0][0]).toEqual({
        service: app,
        method: 'get',
        url: '/',
        description: 'doing something',
        additionalLoggingFields: { foo: 'bar' }
      })

      expect(requestSuccessSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'get',
        params: undefined,
        status: 200,
        url: '/',
        description: 'doing something',
        additionalLoggingFields: { foo: 'bar' },
        code: 200,
        errorIdentifier: null,
        message: null,
        reason: null
      })
    })

    it('should return response and call hook on 400 response with error details', async () => {
      const body = {
        error_identifier: 'AN-ERROR',
        message: 'a-message',
        reason: 'something'
      }
      nock(baseUrl)
        .get('/')
        .reply(400, body)

      try {
        await client.get('/', 'doing something', {
          additionalLoggingFields: { foo: 'bar' }
        })

        throw new Error('test did not throw error in the correct place')
      } catch (error) {
        expect(error.message).toEqual('a-message')
        expect(error.errorCode).toEqual(400)
        expect(error.errorIdentifier).toEqual('AN-ERROR')
      }

      expect(requestFailureSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'get',
        params: undefined,
        status: 400,
        url: '/',
        code: 'ERR_BAD_REQUEST',
        errorIdentifier: 'AN-ERROR',
        message: 'a-message',
        description: 'doing something',
        additionalLoggingFields: { foo: 'bar' },
        reason: 'something'
      })
    })

    it('should return response and call hook on 500 response with error details', async () => {
      const body = {
        error_identifier: 'AN-ERROR',
        message: 'a-message',
        reason: 'something'
      }
      nock(baseUrl)
        .get('/')
        .reply(500, body)

      try {
        await client.get('/', 'doing something', {
          additionalLoggingFields: { foo: 'bar' }
        })

        throw new Error('test did not throw error in the correct place')
      } catch (error) {
        expect(error.message).toEqual('a-message')
        expect(error.errorCode).toEqual(500)
        expect(error.errorIdentifier).toEqual('AN-ERROR')
      }

      expect(requestFailureSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'get',
        params: undefined,
        status: 500,
        url: '/',
        code: 'ERR_BAD_RESPONSE',
        errorIdentifier: 'AN-ERROR',
        message: 'a-message',
        description: 'doing something',
        additionalLoggingFields: { foo: 'bar' },
        reason: 'something'
      })
    })

    it('should return response and call hook on 200 response for PUT request', async () => {
      nock(baseUrl)
        .put('/')
        .reply(200)

      await client.put('/', {}, 'PUT example', { additionalLoggingFields: { foo: 'bar' } })

      expect(requestStartSpy.mock.calls[0][0]).toEqual({
        service: app,
        method: 'put',
        url: '/',
        description: 'PUT example',
        additionalLoggingFields: { foo: 'bar' }
      })

      expect(requestSuccessSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'put',
        params: undefined,
        status: 200,
        url: '/',
        description: 'PUT example',
        additionalLoggingFields: { foo: 'bar' },
        code: 200,
        errorIdentifier: null,
        message: null,
        reason: null
      })
    })

    it('should return response and call hook on 200 response for PATCH request ', async () => {
      const body = {
        foo: 'baz'
      }
      nock(baseUrl)
        .patch('/')
        .reply(200, body)

      await client.patch('/', { foo: 'bar' }, 'PATCH example', { additionalLoggingFields: { foo: 'bar' } })

      expect(requestStartSpy.mock.calls[0][0]).toEqual({
        service: app,
        method: 'patch',
        url: '/',
        description: 'PATCH example',
        additionalLoggingFields: { foo: 'bar' }
      })

      expect(requestSuccessSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'patch',
        params: undefined,
        status: 200,
        url: '/',
        description: 'PATCH example',
        additionalLoggingFields: { foo: 'bar' },
        code: 200,
        errorIdentifier: null,
        message: null,
        reason: null
      })
    })

    it('should return response and call hook on 200 response for DELETE request ', async () => {
      const body = {}
      nock(baseUrl)
        .delete('/')
        .reply(200, body)

      await client.delete('/', 'DELETE example', { additionalLoggingFields: { foo: 'bar' } })

      expect(requestStartSpy.mock.calls[0][0]).toEqual({
        service: app,
        method: 'delete',
        url: '/',
        description: 'DELETE example',
        additionalLoggingFields: { foo: 'bar' }
      })

      expect(requestSuccessSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'delete',
        params: undefined,
        status: 200,
        url: '/',
        description: 'DELETE example',
        additionalLoggingFields: { foo: 'bar' },
        code: 200,
        errorIdentifier: null,
        message: null,
        reason: null
      })
    })

    it('should call call the error hook when it cannot connect to the API', async () => {
      nock(baseUrl)
        .get('/')
        .replyWithError({})

      try {
        await client.get('/', 'foo', {
          additionalLoggingFields: { foo: 'bar' }
        })

        throw new Error('test did not throw error in the correct place')
      } catch (error) {
        expect(requestStartSpy.mock.calls.length).toEqual(1)
        expect(requestFailureSpy.mock.calls.length).toEqual(1)
        expect(nock.isDone()).toEqual(true)
      }

      expect(requestFailureSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'get',
        params: undefined,
        status: undefined,
        url: '/',
        description: 'foo',
        errorIdentifier: undefined,
        message: 'Unknown error',
        additionalLoggingFields: { foo: 'bar' },
        code: undefined,
        reason: 'Unknown reason'
      })
    })
  })

  describe('Response and hooks when acceptAllStatusCodes=true', () => {
    beforeAll(() => {
      client.configure(baseUrl, {
        onRequestStart: requestStartSpy,
        onSuccessResponse: requestSuccessSpy,
        onFailureResponse: requestFailureSpy,
        acceptAllStatusCodes: true
      })
    })

    it('should return response and call hook on 200 response', async () => {
      const body = { foo: 'bar' }
      nock(baseUrl)
        .get('/')
        .reply(200, body)

      const response = await client.get('/', 'doing something', {
        additionalLoggingFields: { foo: 'bar' }
      })

      expect(response.data).toEqual(body)

      expect(requestStartSpy.mock.calls[0][0]).toEqual({
        service: app,
        method: 'get',
        url: '/',
        description: 'doing something',
        additionalLoggingFields: { foo: 'bar' }
      })

      expect(requestSuccessSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'get',
        params: undefined,
        status: 200,
        url: '/',
        description: 'doing something',
        additionalLoggingFields: { foo: 'bar' },
        code: 200,
        errorIdentifier: null,
        message: null,
        reason: null
      })
    })

    it('should return response and call hook on 400 response with error details', async () => {
      const body = {
        error_identifier: 'AN-ERROR',
        message: 'a-message',
        reason: 'something'
      }
      nock(baseUrl)
        .get('/')
        .reply(400, body)

      let response

      try {
        response = await client.get('/', 'doing something', {
          additionalLoggingFields: { foo: 'bar' }
        })

        expect(response.data.message).toEqual('a-message')
        expect(response.status).toEqual(400)
        expect(response.data.error_identifier).toEqual('AN-ERROR')
      } catch (error) {
        throw new Error('test did not throw error in the correct place')
      }

      expect(requestSuccessSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'get',
        params: undefined,
        status: 400,
        url: '/',
        code: 400,
        errorIdentifier: response.data.error_identifier,
        reason: 'something',
        message: response.data.message,
        description: 'doing something',
        additionalLoggingFields: { foo: 'bar' }
      })
    })

    it('should return response and call hook on 500 response with error details', async () => {
      const body = {
        error_identifier: 'AN-ERROR',
        message: 'a-message',
        reason: 'something'
      }
      nock(baseUrl)
        .get('/')
        .reply(500, body)

      let response

      try {
        response = await client.get('/', 'doing something', {
          additionalLoggingFields: { foo: 'bar' }
        })

        expect(response.data.message).toEqual('a-message')
        expect(response.status).toEqual(500)
        expect(response.data.error_identifier).toEqual('AN-ERROR')
      } catch (error) {
        throw new Error('test did not throw error in the correct place')
      }

      expect(requestSuccessSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'get',
        params: undefined,
        status: 500,
        url: '/',
        code: 500,
        errorIdentifier: response.data.error_identifier,
        reason: 'something',
        message: response.data.message,
        description: 'doing something',
        additionalLoggingFields: { foo: 'bar' }
      })
    })

    it('should return response and call hook on 200 response for PUT request', async () => {
      nock(baseUrl)
        .put('/')
        .reply(200)

      await client.put('/', {}, 'PUT example', { additionalLoggingFields: { foo: 'bar' } })

      expect(requestStartSpy.mock.calls[0][0]).toEqual({
        service: app,
        method: 'put',
        url: '/',
        description: 'PUT example',
        additionalLoggingFields: { foo: 'bar' }
      })

      expect(requestSuccessSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'put',
        params: undefined,
        status: 200,
        url: '/',
        description: 'PUT example',
        additionalLoggingFields: { foo: 'bar' },
        code: 200,
        errorIdentifier: null,
        message: null,
        reason: null
      })
    })

    it('should return response and call hook on 200 response for PATCH request ', async () => {
      const body = {
        foo: 'baz'
      }
      nock(baseUrl)
        .patch('/')
        .reply(200, body)

      await client.patch('/', { foo: 'bar' }, 'PATCH example', { additionalLoggingFields: { foo: 'bar' } })

      expect(requestStartSpy.mock.calls[0][0]).toEqual({
        service: app,
        method: 'patch',
        url: '/',
        description: 'PATCH example',
        additionalLoggingFields: { foo: 'bar' }
      })

      expect(requestSuccessSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'patch',
        params: undefined,
        status: 200,
        url: '/',
        description: 'PATCH example',
        additionalLoggingFields: { foo: 'bar' },
        code: 200,
        errorIdentifier: null,
        message: null,
        reason: null
      })
    })

    it('should return response and call hook on 200 response for DELETE request ', async () => {
      const body = {}
      nock(baseUrl)
        .delete('/')
        .reply(200, body)

      await client.delete('/', 'DELETE example', { additionalLoggingFields: { foo: 'bar' } })

      expect(requestStartSpy.mock.calls[0][0]).toEqual({
        service: app,
        method: 'delete',
        url: '/',
        description: 'DELETE example',
        additionalLoggingFields: { foo: 'bar' }
      })

      expect(requestSuccessSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'delete',
        params: undefined,
        status: 200,
        url: '/',
        description: 'DELETE example',
        additionalLoggingFields: { foo: 'bar' },
        code: 200,
        errorIdentifier: null,
        message: null,
        reason: null
      })
    })

    it('should call call the error hook when it cannot connect to the API', async () => {
      nock(baseUrl)
        .get('/')
        .replyWithError({})

      try {
        await client.get('/', 'foo', {
          additionalLoggingFields: { foo: 'bar' }
        })

        throw new Error('test did not throw error in the correct place')
      } catch (error) {
        expect(requestStartSpy.mock.calls.length).toEqual(1)
        expect(requestFailureSpy.mock.calls.length).toEqual(1)
        expect(nock.isDone()).toEqual(true)
      }

      expect(requestFailureSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'get',
        params: undefined,
        status: undefined,
        url: '/',
        description: 'foo',
        errorIdentifier: undefined,
        message: 'Unknown error',
        additionalLoggingFields: { foo: 'bar' },
        code: undefined,
        reason: 'Unknown reason'
      })
    })
  })

  describe('Retries when acceptAllStatusCodes=false', () => {
    beforeAll(() => {
      client.configure(baseUrl, {
        onRequestStart: requestStartSpy,
        onSuccessResponse: requestSuccessSpy,
        onFailureResponse: requestFailureSpy
      })
    })

    it('should retry GET request 3 times when ECONNRESET error thrown', async () => {
      nock(baseUrl)
        .get('/')
        .times(3)
        .reply(500, {
          code: 'ECONNRESET'
        })

      try {
        await client.get('/', 'foo', {
          additionalLoggingFields: { foo: 'bar' }
        })

        throw new Error('test did not throw error in the correct place')
      } catch (error) {
        expect(error.errorCode).toEqual(500)
        expect(requestStartSpy.mock.calls.length).toEqual(3)
        expect(requestStartSpy.mock.calls[0][0]).toEqual({
          service: 'an-app',
          method: 'get',
          url: '/',
          description: 'foo',
          additionalLoggingFields: { foo: 'bar' }
        })
        expect(requestFailureSpy.mock.calls.length).toEqual(3)
        expect(nock.isDone()).toEqual(true)
      }
    })

    it('should not retry POST requests when ECONNRESET error returned', async () => {
      nock(baseUrl)
        .post('/')
        .reply(500, {
          code: 'ECONNRESET'
        })

      try {
        await client.post('/', 'foo', {
          additionalLoggingFields: { foo: 'bar' }
        })

        throw new Error('test did not throw error in the correct place')
      } catch (error) {
        expect(error.errorCode).toEqual(500)
        expect(requestStartSpy.mock.calls.length).toEqual(1)
        expect(requestSuccessSpy.mock.calls.length).toEqual(0)
        expect(requestFailureSpy.mock.calls.length).toEqual(1)
        expect(nock.isDone()).toEqual(true)
      }
    })

    it('should not retry for an error other than ECONNRESET', async () => {
      nock(baseUrl)
        .get('/')
        .reply(500, {
          code: 'a code'
        })

      try {
        await client.get('/', 'foo', {
          additionalLoggingFields: { foo: 'bar' }
        })

        throw new Error('test did not throw error in the correct place')
      } catch (error) {
        expect(error.errorCode).toEqual(500)
        expect(requestStartSpy.mock.calls.length).toEqual(1)
        expect(requestSuccessSpy.mock.calls.length).toEqual(0)
        expect(requestFailureSpy.mock.calls.length).toEqual(1)
        expect(nock.isDone()).toEqual(true)
      }
    })
  })

  describe('Retries when  acceptAllStatusCodes=true', () => {
    beforeAll(() => {
      client.configure(baseUrl, {
        onRequestStart: requestStartSpy,
        onSuccessResponse: requestSuccessSpy,
        onFailureResponse: requestFailureSpy,
        acceptAllStatusCodes: true
      })
    })

    it('should retry GET request 3 times when ECONNRESET error thrown', async () => {
      nock(baseUrl)
        .get('/')
        .times(3)
        .reply(500, {
          code: 'ECONNRESET'
        })

      try {
        const response = await client.get('/', 'foo', {
          additionalLoggingFields: { foo: 'bar' }
        })

        expect(response.status).toEqual(500)
        expect(requestStartSpy.mock.calls.length).toEqual(3)
        expect(requestStartSpy.mock.calls[0][0]).toEqual({
          service: 'an-app',
          method: 'get',
          url: '/',
          description: 'foo',
          additionalLoggingFields: { foo: 'bar' }
        })

        expect(requestSuccessSpy.mock.calls.length).toEqual(3)
        expect(requestFailureSpy.mock.calls.length).toEqual(0)
        expect(nock.isDone()).toEqual(true)
      } catch (error) {
        throw new Error('test did not throw error in the correct place')
      }
    })

    it('should not retry POST requests when ECONNRESET error returned', async () => {
      nock(baseUrl)
        .post('/')
        .reply(500, {
          code: 'ECONNRESET'
        })

      try {
        const response = await client.post('/', 'foo', {
          additionalLoggingFields: { foo: 'bar' }
        })

        expect(response.status).toEqual(500)
        expect(requestStartSpy.mock.calls.length).toEqual(1)
        expect(requestSuccessSpy.mock.calls.length).toEqual(1)
        expect(requestFailureSpy.mock.calls.length).toEqual(0)
        expect(nock.isDone()).toEqual(true)
      } catch (error) {
        throw new Error('test did not throw error in the correct place')
      }
    })

    it('should not retry for an error other than ECONNRESET', async () => {
      nock(baseUrl)
        .get('/')
        .reply(500, {
          code: 'a code'
        })

      try {
        const response = await client.get('/', 'foo', {
          additionalLoggingFields: { foo: 'bar' }
        })

        expect(response.status).toEqual(500)
        expect(requestStartSpy.mock.calls.length).toEqual(1)
        expect(requestSuccessSpy.mock.calls.length).toEqual(1)
        expect(requestFailureSpy.mock.calls.length).toEqual(0)
        expect(nock.isDone()).toEqual(true)
      } catch (error) {
        throw new Error('test did not throw error in the correct place')
      }
    })
  })
})
