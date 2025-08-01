'use strict'

class RESTClientError extends Error {
  constructor (message, service, errorCode, errorIdentifier, reason) {
    super(message)
    this.name = this.constructor.name
    this.service = service
    this.errorCode = errorCode
    this.errorIdentifier = errorIdentifier
    this.reason = reason
  }
}

module.exports = {
  RESTClientError
}
