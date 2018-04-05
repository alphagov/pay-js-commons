// 'use strict'

const {describe, before, after, it} = require('mocha')
const {expect} = require('chai')
const sinon = require('sinon');

const MAX_AMOUNT = 100000

describe('Field validation', () => {
  const fixtures = {
    label: 'Your name',
    inputId: 'test-input'
  }
  const fixtureHTML = `
          <form id="fixture" data-validate>
            <div class="form-group">
              <label for="${fixtures.inputId}">
                ${fixtures.label}
              </label>
              <input
                id="${fixtures.inputId}"
                name="test"
                type="text"
                data-validate="required"
              />
            </div>
            <button type="submit">Submit</button>
          </form>`

  describe('Test for general error state labels', () => {
    before('Arrange', () => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      document.getElementById('fixture').submit = sinon.spy()
    })

    before('Act', () => {
      document.querySelector('button').click()
    })

    after(() => {
      document.body.innerHTML = ''
    })

    it(`It should not submit the form`, () => {
      expect(document.getElementById('fixture').submit.called).to.equal(false)
    })
    it(`It should add 'error' as a class to the .form-group`, () => {
      expect(document.getElementsByClassName('form-group')[0].classList.contains('error')).to.equal(true)
    })
    it(`It should show an error summary`, () => {
      expect(document.getElementById('error-summary')).to.exist // eslint-disable-line no-unused-expressions
    })
    it(`The error summary should link to the errored input ‘${fixtures.inputId}’`, () => {
      expect(document.querySelector(`a[href="#${fixtures.inputId}"]`)).to.exist // eslint-disable-line no-unused-expressions
    })
    it(`The error summary should link text should be ‘${fixtures.label}’`, () => {
      expect(document.querySelector(`a[href="#${fixtures.inputId}"]`).innerHTML).to.equal(`${fixtures.label}`)
    })
  })
  describe('For a required input', () => {
    describe('that is left blank', () => {
      before('Arrange', () => {
        document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
        window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
        document.getElementById('fixture').submit = sinon.spy()
      })

      before('Act', () => {
        document.querySelector('button').click()
      })

      after(() => {
        document.body.innerHTML = ''
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`This field cannot be blank`)
      })
    })
    describe('that has value', () => {
      before('Arrange', () => {
        document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
        window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
        document.getElementById('fixture').submit = sinon.spy()
      })

      before('Act', () => {
        document.getElementById(fixtures.inputId).value = 'hello'
        document.querySelector('button').click()
      })

      after(() => {
        document.body.innerHTML = ''
      })

      it(`should submit the form`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(true)
      })
    })
  })
  describe('For a currency input', () => {
    before('Arrange', () => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.getElementById(fixtures.inputId).dataset.validate = 'currency'
      window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      document.getElementById('fixture').submit = sinon.spy()
    })

    after(() => {
      document.body.innerHTML = ''
    })

    describe('that is left blank', () => {
      before('Act', () => {
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`Choose an amount in pounds and pence using digits and a decimal point. For example “10.50”`)
      })
    })
    describe('that is just non-numeric characters', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = 'hello'
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`Choose an amount in pounds and pence using digits and a decimal point. For example “10.50”`)
      })
    })
    describe('that has non-numeric characters in it', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = '10g.00'
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`Choose an amount in pounds and pence using digits and a decimal point. For example “10.50”`)
      })
    })
    describe('that is has valid currency amount in pounds with no pence', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = '10'
        document.querySelector('button').click()
      })

      it(`should submit the form`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(true)
      })
    })
    describe('that is has valid currency amount in pounds and pence', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = '10.00'
        document.querySelector('button').click()
      })

      it(`should submit the form`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(true)
      })
    })
  })
  describe('For an email input', () => {
    before('Arrange', () => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.getElementById(fixtures.inputId).dataset.validate = 'email'
      window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      document.getElementById('fixture').submit = sinon.spy()
    })

    after(() => {
      document.body.innerHTML = ''
    })

    describe('that is left blank', () => {
      before('Act', () => {
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`Please use a valid email address`)
      })
    })
    describe('that has invalid email', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = 'invalid@testemail'
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`Please use a valid email address`)
      })
    })
    describe('that is valid email', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = 'invalid@testemail.com'
        document.querySelector('button').click()
      })

      it(`should submit the form`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(true)
      })
    })
  })
  describe('For an telephone number input', () => {
    before('Arrange', () => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.getElementById(fixtures.inputId).dataset.validate = 'phone'
      window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      document.getElementById('fixture').submit = sinon.spy()
    })

    after(() => {
      document.body.innerHTML = ''
    })

    describe('that is left blank', () => {
      before('Act', () => {
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`Must be a 11 digit phone number`)
      })
    })
    describe('that has invalid phone number', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = '077'
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`Must be a 11 digit phone number`)
      })
    })
    describe('that is valid phone number', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = '077 777 777 77'
        document.querySelector('button').click()
      })

      it(`should submit the form`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(true)
      })
    })
  })
  describe('To check is currency and is below max amount', () => {
    before('Arrange', () => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.getElementById(fixtures.inputId).dataset.validate = 'currency belowMaxAmount'
      window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      document.getElementById('fixture').submit = sinon.spy()
    })

    after(() => {
      document.body.innerHTML = ''
    })

    describe('that is left blank', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = ''
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`Choose an amount in pounds and pence using digits and a decimal point. For example “10.50”`)
      })
    })
    describe('where value is too large', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = '1000000000000'
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`Choose an amount under £${MAX_AMOUNT.toLocaleString()}`)
      })
    })
    describe('where value is within range', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = '100'
        document.querySelector('button').click()
      })

      it(`should submit the form`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(true)
      })
    })
  })
  describe('To check if password is at least 10 characters', () => {
    before('Arrange', () => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.getElementById(fixtures.inputId).dataset.validate = 'passwordLessThanTenChars'
      window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      document.getElementById('fixture').submit = sinon.spy()
    })

    after(() => {
      document.body.innerHTML = ''
    })

    describe('that is left blank', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = ''
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`Choose a Password of 10 characters or longer`)
      })
    })
    describe('where value is not long enough', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = '387nrd'
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`Choose a Password of 10 characters or longer`)
      })
    })
    describe('where value is long enough', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = '893n7e98ynz283n98nz3'
        document.querySelector('button').click()
      })

      it(`should submit the form`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(true)
      })
    })
  })
  describe('To check if required field is less than max characters allowed', () => {
    before('Arrange', () => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.getElementById(fixtures.inputId).dataset.validate = 'required isFieldGreaterThanMaxLengthChars'
      window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      document.getElementById('fixture').submit = sinon.spy()
    })

    after(() => {
      // document.body.innerHTML = ''
    })

    describe('that is left blank', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).dataset.validateMaxLength = '5'
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`This field cannot be blank`)
      })
    })
    describe('where value is too long', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).dataset.validateMaxLength = '5'
        document.getElementById(fixtures.inputId).value = '123456'
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`The text is too long`)
      })
    })
    describe('where value is not too long', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).dataset.validateMaxLength = '5'
        document.getElementById(fixtures.inputId).value = '123'
        document.querySelector('button').click()
      })

      it(`should submit the form`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(true)
      })
    })
  })
  describe('To check if required input is NAXSI safe', () => {
    before('Arrange', () => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.getElementById(fixtures.inputId).dataset.validate = 'required isNaxsiSafe'
      window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      document.getElementById('fixture').submit = sinon.spy()
    })

    after(() => {
      // document.body.innerHTML = ''
    })

    describe('that is left blank', () => {
      before('Act', () => {
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`This field cannot be blank`)
      })
    })
    describe('where value contains NAXSI flaggable characters', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = `<?php echo 'bad things'; ?>`
        document.querySelector('button').click()
      })

      it(`should show the error message in the label`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(false)
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`You cannot use any of the following characters &lt; &gt; ; : \` ( ) " ' = | , ~ [ ]`)
      })
    })
    describe('where value is NAXSI safe', () => {
      before('Act', () => {
        document.getElementById(fixtures.inputId).value = '123'
        document.querySelector('button').click()
      })

      it(`should submit the form`, () => {
        expect(document.getElementById('fixture').submit.called).to.equal(true)
      })
    })
  })
})
