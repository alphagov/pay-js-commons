'use strict'

const http = require('http')
const https = require('https')
const axios = require('axios')
const { RESTClientError } = require('./errors')

class Client {
  constructor (app) {
    this._app = app
  }

  /**
   * Configure the client. Should only be called once.
   */
  configure (baseURL, options) {
    const axiosConfigOptions = {
      baseURL,
      timeout: 60 * 1000,
      maxContentLength: 50 * 1000 * 1000,
      httpAgent: new http.Agent({
        keepAlive: true
      }),
      httpsAgent: new https.Agent({
        keepAlive: true,
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }

    if (options.acceptAllStatusCodes) {
      axiosConfigOptions.validateStatus = (status) => status
    }

    this._axios = axios.create(axiosConfigOptions)

    this._axios.interceptors.request.use(config => {
      const requestContext = {
        service: this._app,
        method: config.method,
        url: config.url,
        description: config.description,
        additionalLoggingFields: config.additionalLoggingFields,
        ...config.retryCount && { retryCount: config.retryCount }
      }
      if (options.onRequestStart) {
        options.onRequestStart(requestContext)
      }

      const headers = options.transformRequestAddHeaders ? options.transformRequestAddHeaders() : {}
      Object.entries(headers)
        .forEach(([headerKey, headerValue]) => {
          config.headers[headerKey] = headerValue
        })

      return {
        ...config,
        metadata: { start: Date.now() }
      }
    })

    this._axios.interceptors.response.use(async (response) => {
      const responseContext = {
        service: this._app,
        responseTime: Date.now() - (response.config).metadata.start,
        method: response.config.method,
        params: response.config.params,
        status: response.status,
        url: response.config.url,
        description: response.config.description,
        additionalLoggingFields: response.config.additionalLoggingFields,
        code: response.status,
        errorIdentifier: response.data && response.data.error_identifier ? response.data.error_identifier : null,
        reason: response.data && response.data.reason ? response.data.reason : null,
        message: response.data && response.data.message ? response.data.message : null
      }

      if (response.config.method === 'get' && response.data.code === 'ECONNRESET') {
        const retryCount = response.config.retryCount || 0

        if (retryCount < 2) {
          response.config.retryCount = retryCount + 1

          if (options.onSuccessResponse) {
            options.onSuccessResponse(responseContext)
          }

          await new Promise(resolve => setTimeout(resolve, 500))
          return this._axios(response.config)
        }
      }

      if (options.onSuccessResponse) {
        options.onSuccessResponse(responseContext)
      }

      return response
    }, async (error) => {
      const config = error.config || {}

      let message

      if (error.response && error.response.data && error.response.data.errors) {
        message = error.response.data.errors.join(', ')
      } else if (error.response && error.response.data && error.response.data.message) {
        message = error.response.data.message
      } else {
        message = 'Unknown error'
      }

      const errorContext = {
        service: this._app,
        responseTime: Date.now() - (config.metadata && config.metadata.start),
        method: config.method,
        status: (error.response && error.response.status) || error.status,
        url: config.url,
        params: config.params,
        code: (error.response && error.response.data && error.response.data.code) || error.code,
        message,
        reason: (error.response && error.response.data && error.response.data.reason) || 'Unknown reason',
        description: config.description,
        additionalLoggingFields: config.additionalLoggingFields,
        errorIdentifier: (error.response && error.response.data && error.response.data.error_identifier)
      }

      const errorCode = error.response && error.response.data && error.response.data.code

      if (config.method === 'get' && errorCode === 'ECONNRESET') {
        const retryCount = config.retryCount || 0
        if (retryCount < 2) {
          config.retryCount = retryCount + 1
          if (options.onFailureResponse) {
            errorContext.retry = true
            options.onFailureResponse(errorContext)
          }
          await new Promise(resolve => setTimeout(resolve, 500))
          return this._axios(config)
        }
      }

      if (options.onFailureResponse) {
        options.onFailureResponse(errorContext)
      }

      throw new RESTClientError(errorContext.message, errorContext.service, errorContext.status, errorContext.errorIdentifier, errorContext.reason)
    })
  }

  _getConfigWithDescription (config = {}, description) {
    return {
      ...config,
      description
    }
  }

  get (url, description, config) {
    return this._axios.get(url, this._getConfigWithDescription(config, description))
  }

  post (url, payload, description, config) {
    return this._axios.post(url, payload, this._getConfigWithDescription(config, description))
  }

  put (url, payload, description, config) {
    return this._axios.put(url, payload, this._getConfigWithDescription(config, description))
  }

  patch (url, payload, description, config) {
    return this._axios.patch(url, payload, this._getConfigWithDescription(config, description))
  }

  delete (url, description, config) {
    return this._axios.delete(url, this._getConfigWithDescription(config, description))
  }
}

module.exports = {
  Client
}
