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
  client.configure(baseUrl, {
    onRequestStart: requestStartSpy,
    onSuccessResponse: requestSuccessSpy,
    onFailureResponse: requestFailureSpy
  })

  beforeEach(() => {
    requestStartSpy.mockClear()
    requestFailureSpy.mockClear()
    requestSuccessSpy.mockClear()
  })

  describe('Response and hooks', () => {
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
  })

  describe('Retries', () => {
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

        console.log('%%% success hook')
        console.log('%%% response: ', response.status)
        expect(response.status).toEqual(500)
        expect(requestStartSpy.mock.calls.length).toEqual(3)
        expect(requestStartSpy.mock.calls[0][0]).toEqual({
          service: 'an-app',
          method: 'get',
          url: '/',
          description: 'foo',
          additionalLoggingFields: { foo: 'bar' }
        })
        expect(nock.isDone()).toEqual(true)
        console.log('** finish')
        console.log('')
      } catch (error) {
        console.log('** Error hook')
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

        console.log('%%% success hook')
        console.log('%%% response: ', response.status)
        console.log('%%% requestFailureSpy.mock.calls.length: ', requestFailureSpy.mock.calls)
        expect(response.status).toEqual(500)
        expect(requestStartSpy.mock.calls.length).toEqual(1)
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
        expect(requestFailureSpy.mock.calls.length).toEqual(0)
        expect(nock.isDone()).toEqual(true)
        console.log('** finish code')
      } catch (error) {
        throw new Error('test did not throw error in the correct place')
      }
    })
  })

  describe('Error calling API', () => {
    it.only('should return response and call hook on 200 response for DELETE request ', async () => {
      const body = {}
      nock(baseUrl)
        .post('/')
        .replyWithError()

      let response
      try {
        response = await client.get('/', 'foo', {
          additionalLoggingFields: { foo: 'bar' }
        })

        throw new Error('test did not throw error in the correct place')
      } catch (error) {
        // expect(response.status).toEqual(500)
        expect(requestStartSpy.mock.calls.length).toEqual(1)
        expect(requestFailureSpy.mock.calls.length).toEqual(0)
        // expect(nock.isDone()).toEqual(true)
        console.log('** error hook')
      }
    })
  })
})
