// 'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')

const emailValidator = require('./is-valid-email')

describe('When the email validation function', () => {
  describe('is passed an invalid email address', () => {
    it(`should return false`, () => {
      expect(emailValidator('name@mail')).to.equal(false)
    })
  })
  describe('is passed an a valid email address', () => {
    it(`should return true`, () => {
      expect(emailValidator('name@mail.com')).to.equal(true)
      expect(emailValidator('first.last@subdomain.mail.com')).to.equal(true)
      expect(emailValidator('first.last@digital.cabinet-office.gov.uk')).to.equal(true)
    })
  })
})
