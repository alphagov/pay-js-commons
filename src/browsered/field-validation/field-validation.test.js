'use strict'

Object.defineProperty(window, 'scroll', { value: jest.fn(), writable: true })
const { enableFieldValidation } = require('./field-validation')

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

  describe.only('Test for general error state labels', () => {
    beforeAll(() => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      console.log('==Inserted element:', document.querySelector('#fixture').outerHTML)
      console.log('==Button:', document.querySelector('button').outerHTML)
      enableFieldValidation()
      const form = document.querySelector('#fixture')
      form.submit = jest.fn()

      // form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      form.requestSubmit()

      // button.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
      document.querySelector('button').click()
    })

    afterAll(() => {
      document.body.innerHTML = ''
    })

    it('It should not submit the form', () => {
      expect(document.querySelector('#fixture').submit).not.toHaveBeenCalled()
    })
    it('It should add \'error\' as a class to the .form-group', () => {
      // expect(document.querySelectorAll('.form-group')[0].classList.contains('error')).toBe(true)
      expect(document.querySelectorAll('.form-group')[0].classList.contains('error')).toBe(true)
    })
    it('It should show an error summary', () => {
      expect(document.querySelector('#error-summary')).toBeDefined() // eslint-disable-line no-unused-expressions
    })
    it(`The error summary should link to the errored input '${fixtures.inputId}'`, () => {
      expect(document.querySelector(`a[href="#${fixtures.inputId}"]`)).toBeDefined() // eslint-disable-line no-unused-expressions
    })
    it(`The error summary should link text should be '${fixtures.label}`, () => {
      expect(document.querySelector(`a[href="#${fixtures.inputId}"]`).innerHTML).toEqual((`${fixtures.label}`))
    })
  })

  describe('For a required input', () => {
    describe('that is left blank', () => {
      beforeAll(() => {
        document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
        enableFieldValidation()
        document.querySelector('#fixture').submit = jest.fn()
      })

      beforeAll(() => {
        document.querySelector('button').click()
      })

      afterAll(() => {
        document.body.innerHTML = ''
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit).not.toHaveBeenCalled()
        expect(document.querySelectorAll('.error-message')[0].innerHTML).toEqual('This field cannot be blank')
      })
    })

    describe('that has value', () => {
      beforeAll(() => {
        document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
        enableFieldValidation()
        document.querySelector('#fixture').submit = jest.fn()
      })

      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = 'hello'
        document.querySelector('button').click()
      })

      afterAll(() => {
        document.body.innerHTML = ''
      })

      it('should submit the form', () => {
        expect(document.querySelector('#fixture').submit).toHaveBeenCalled()
      })
    })
  })

  describe('For a currency input', () => {
    beforeAll(() => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.querySelector(`#${fixtures.inputId}`).dataset.validate = 'currency'
      enableFieldValidation()
      document.querySelector('#fixture').submit = jest.fn()
    })

    afterAll(() => {
      document.body.innerHTML = ''
    })

    describe('that is left blank', () => {
      beforeAll(() => {
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit).not.toHaveBeenCalled()
        expect(document.querySelectorAll('.error-message')[0].innerHTML).toEqual('Choose an amount in pounds and pence using digits and a decimal point. For example “10.50”')
      })
    })

    describe('that is just non-numeric characters', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = 'hello'
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit).not.toHaveBeenCalled()
        expect(document.querySelectorAll('.error-message')[0].innerHTML).toEqual('Choose an amount in pounds and pence using digits and a decimal point. For example “10.50”')
      })
    })

    describe('that has non-numeric characters in it', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = '10g.00'
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit).not.toHaveBeenCalled()
        expect(document.querySelectorAll('.error-message')[0].innerHTML).toEqual('Choose an amount in pounds and pence using digits and a decimal point. For example “10.50”')
      })
    })

    describe('that is has valid currency amount in pounds with no pence', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = '10'
        document.querySelector('button').click()
      })

      it('should submit the form', () => {
        expect(document.querySelector('#fixture').submit).toHaveBeenCalled()
      })
    })

    describe('that is has valid currency amount in pounds and pence', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = '10.00'
        document.querySelector('button').click()
      })

      it('should submit the form', () => {
        expect(document.querySelector('#fixture').submit).toHaveBeenCalled()
      })
    })
  })

  describe('For an email input', () => {
    beforeAll(() => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.querySelector(`#${fixtures.inputId}`).dataset.validate = 'email'
      enableFieldValidation()
      document.querySelector('#fixture').submit = jest.fn()
    })

    afterAll(() => {
      document.body.innerHTML = ''
    })

    describe('that is left blank', () => {
      beforeAll(() => {
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit).not.toHaveBeenCalled()
        expect(document.querySelectorAll('.error-message')[0].innerHTML).toEqual('Please use a valid email address')
      })
    })

    describe('that has invalid email', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = 'invalid@testemail'
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(false)
        expect(document.querySelectorAll('.error-message')[0].innerHTML).to.equal('Please use a valid email address')
      })
    })

    describe('that is valid email', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = 'invalid@testemail.com'
        document.querySelector('button').click()
      })

      it('should submit the form', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(true)
      })
    })
  })

  describe('For an telephone number input', () => {
    beforeAll(() => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.querySelector(`#${fixtures.inputId}`).dataset.validate = 'phone'
      window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      document.querySelector('#fixture').submit = jest.fn()
    })

    afterAll(() => {
      document.body.innerHTML = ''
    })

    describe('that is left blank', () => {
      beforeAll(() => {
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(false)
        expect(document.querySelectorAll('.error-message')[0].innerHTML).to.equal('Must be a 11 digit phone number')
      })
    })

    describe('that has invalid phone number', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = '077'
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(false)
        expect(document.querySelectorAll('.error-message')[0].innerHTML).to.equal('Must be a 11 digit phone number')
      })
    })

    describe('that is valid phone number', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = '077 777 777 77'
        document.querySelector('button').click()
      })

      it('should submit the form', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(true)
      })
    })
  })

  describe('To check is currency and is below max amount', () => {
    beforeAll(() => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.querySelector(`#${fixtures.inputId}`).dataset.validate = 'currency belowMaxAmount'
      window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      document.querySelector('#fixture').submit = jest.fn()
    })

    afterAll(() => {
      document.body.innerHTML = ''
    })

    describe('that is left blank', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = ''
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(false)
        expect(document.querySelectorAll('.error-message')[0].innerHTML).to.equal('Choose an amount in pounds and pence using digits and a decimal point. For example “10.50”')
      })
    })

    describe('where value is too large', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = '1000000000000'
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(false)
        expect(document.querySelectorAll('.error-message')[0].innerHTML).to.equal(`Choose an amount under £${MAX_AMOUNT.toLocaleString()}`)
      })
    })

    describe('where value is within range', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = '100'
        document.querySelector('button').click()
      })

      it('should submit the form', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(true)
      })
    })
  })

  describe('To check if password is at least 10 characters', () => {
    beforeAll(() => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.querySelector(`#${fixtures.inputId}`).dataset.validate = 'passwordLessThanTenChars'
      window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      document.querySelector('#fixture').submit = jest.fn()
    })

    afterAll(() => {
      document.body.innerHTML = ''
    })

    describe('that is left blank', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = ''
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(false)
        expect(document.querySelectorAll('.error-message')[0].innerHTML).to.equal('Choose a Password of 10 characters or longer')
      })
    })

    describe('where value is not long enough', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = '387nrd'
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(false)
        expect(document.querySelectorAll('.error-message')[0].innerHTML).to.equal('Choose a Password of 10 characters or longer')
      })
    })

    describe('where value is exactly 10 characters', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = '1234567890'
        document.querySelector('button').click()
      })

      it('should submit the form', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(true)
      })
    })

    describe('where value is long enough', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = '893n7e98ynz283n98nz3'
        document.querySelector('button').click()
      })

      it('should submit the form', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(true)
      })
    })
  })

  describe('To check if required field is less than max characters allowed', () => {
    beforeAll(() => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.querySelector(`#${fixtures.inputId}`).dataset.validate = 'required isFieldGreaterThanMaxLengthChars'
      window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      document.querySelector('#fixture').submit = jest.fn()
    })

    describe('that is left blank', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).dataset.validateMaxLength = '5'
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(false)
        expect(document.querySelectorAll('.error-message')[0].innerHTML).to.equal('This field cannot be blank')
      })
    })

    describe('where value is too long', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).dataset.validateMaxLength = '5'
        document.querySelector(`#${fixtures.inputId}`).value = '123456'
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(false)
        expect(document.querySelectorAll('.error-message')[0].innerHTML).to.equal('The text is too long')
      })
    })

    describe('where value is not too long', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).dataset.validateMaxLength = '5'
        document.querySelector(`#${fixtures.inputId}`).value = '123'
        document.querySelector('button').click()
      })

      it('should submit the form', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(true)
      })
    })
  })

  describe('To check if required input is NAXSI safe', () => {
    beforeAll(() => {
      document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
      document.querySelector(`#${fixtures.inputId}`).dataset.validate = 'required isNaxsiSafe'
      window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      document.querySelector('#fixture').submit = jest.fn()
    })

    describe('that is left blank', () => {
      beforeAll(() => {
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(false)
        expect(document.querySelectorAll('.error-message')[0].innerHTML).to.equal('This field cannot be blank')
      })
    })

    describe('where value contains NAXSI flaggable characters', () => {
      beforeAll(() => {
        document.querySelector(`#${fixtures.inputId}`).value = '<?php echo "bad things"; ?>'
        document.querySelector('button').click()
      })

      it('should show the error message in the label', () => {
        expect(document.querySelector('#fixture').submit.called).to.equal(false)
        expect(document.querySelectorAll('.error-message')[0].innerHTML).to.equal('You cannot use any of the following characters &lt; &gt; ; : ` ( ) " \' = | , ~ [ ]')
      })
    })

    describe('where value is NAXSI safe', () => {
      it('should submit the form', () => {
        document.querySelector(`#${fixtures.inputId}`).value = '123'
        document.querySelector('button').click()
        expect(document.querySelector('#fixture').submit.called).to.equal(true)
      })
      it('apostrophes should be ok', () => {
        document.querySelector(`#${fixtures.inputId}`).value = 'O’Connell'
        document.querySelector('button').click()
        expect(document.querySelector('#fixture').submit.called).to.equal(true)
      })
    })
  })
})
