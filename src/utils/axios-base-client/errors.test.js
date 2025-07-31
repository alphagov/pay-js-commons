'use strict'

const { expect } = require('chai')
const { 
  RESTClientError
} = require('./errors')

describe('Error classes', () => {
  it('should construct RESTClientError', () => {
    const error = new RESTClientError('client error')
    expect(error.message).to.equal('client error')
    expect(error.name).to.equal('RESTClientError')
    expect(error.stack).to.not.be.null // eslint-disable-line
  })
})
