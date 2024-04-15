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

class DomainError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

class NotFoundError extends DomainError {
}

class AccountCannotTakePaymentsError extends DomainError {
}

class InvalidPrefilledAmountError extends DomainError {
}

class InvalidPrefilledReferenceError extends DomainError {
}

module.exports = {
  RESTClientError,
  NotFoundError,
  AccountCannotTakePaymentsError,
  InvalidPrefilledAmountError,
  InvalidPrefilledReferenceError
}
