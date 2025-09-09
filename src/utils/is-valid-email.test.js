'use strict'
const emailValidator = require('./is-valid-email')

describe('When the email validation function', () => {
  describe('is passed an invalid email address', () => {
    it('should return false', () => {
      expect(emailValidator('name@mail')).toEqual(false)
    })
  })
  describe('is passed an a valid email address', () => {
    it('should return true', () => {
      expect(emailValidator('name@mail.com')).toEqual(true)
      expect(emailValidator('first.last@subdomain.mail.com')).toEqual(true)
      expect(emailValidator('first.last@digital.cabinet-office.gov.uk')).toEqual(true)
    })
  })
})
