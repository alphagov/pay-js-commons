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
    it('should return response and call success hook on 200 response', async () => {
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
        additionalLoggingFields: { foo: 'bar' }
      })
    })

    it('should throw error and call failure hook on 400 response', async () => {
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
      } catch (error) {
        expect(error.message).toEqual('a-message')
        expect(error.errorCode).toEqual(400)
        expect(error.errorIdentifier).toEqual('AN-ERROR')
        expect(error.service).toEqual(app)
      }

      expect(requestFailureSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'get',
        params: undefined,
        status: 400,
        url: '/',
        code: 400,
        errorIdentifier: body.error_identifier,
        reason: 'something',
        message: body.message,
        description: 'doing something',
        additionalLoggingFields: { foo: 'bar' }
      })
    })

    it('should throw error and call failure hook on 500 response', async () => {
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
      } catch (error) {
        expect(error.message).toEqual('a-message')
        expect(error.errorCode).toEqual(500)
        expect(error.errorIdentifier).toEqual('AN-ERROR')
        expect(error.service).toEqual(app)
      }

      expect(requestFailureSpy.mock.calls[0][0]).toEqual({
        service: app,
        responseTime: expect.any(Number),
        method: 'get',
        params: undefined,
        status: 500,
        url: '/',
        code: 500,
        errorIdentifier: body.error_identifier,
        reason: 'something',
        message: body.message,
        description: 'doing something',
        additionalLoggingFields: { foo: 'bar' }
      })
    })
  })

  describe('Retries', () => {
    it('should retry GET request 3 times when ECONNRESET error thrown', async () => {
      nock(baseUrl)
        .get('/')
        .times(3)
        .replyWithError({
          code: 'ECONNRESET',
          response: { status: 500 }
        })

      try {
        await client.get('/', 'foo', {
          additionalLoggingFields: { foo: 'bar' }
        })
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
        expect(nock.isDone()).toEqual(true)
      }
    })

    it('should not retry POST requests when ECONNRESET error returned', async () => {
      nock(baseUrl)
        .post('/')
        .replyWithError({
          code: 'ECONNRESET',
          response: { status: 500 }
        })

      try {
        await client.post('/', 'foo', {
          additionalLoggingFields: { foo: 'bar' }
        })
      } catch (error) {
        expect(error.errorCode).toEqual(500)
        expect(requestStartSpy.mock.calls[0].length).toEqual(1)
        expect(requestFailureSpy.mock.calls[0].length).toEqual(1)
        expect(requestFailureSpy.mock.calls[0][0].retryCount).toBeUndefined()
        expect(nock.isDone()).toEqual(true)
      }

    })

    it('should not retry for an error other than ECONNRESET', async () => {
      nock(baseUrl)
        .get('/')
        .replyWithError({
          response: { status: 500 }
        })

      try {
        await client.get('/', 'foo', {
          additionalLoggingFields: { foo: 'bar' }
        })
      } catch (error) {
        expect(error.errorCode).toEqual(500)
        expect(requestStartSpy.mock.calls[0].length).toEqual(1)
        expect(requestFailureSpy.mock.calls[0].length).toEqual(1)
        expect(requestFailureSpy.mock.calls[0][0].retryCount).toBeUndefined()
        expect(nock.isDone()).toEqual(true)
      }
    })
  })
})
