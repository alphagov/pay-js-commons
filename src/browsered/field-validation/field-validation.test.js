// 'use strict'

const {describe, before, after, it} = require('mocha')
const {expect} = require('chai')

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

  describe('For a single required input', () => {
    describe('if the input is left blank', () => {
      before('Arrange', () => {
        document.body.insertAdjacentHTML('afterbegin', fixtureHTML)
        window.GOVUKPAY.browsered.fieldValidation.enableFieldValidation()
      })

      before('Act', () => {
        document.querySelector('button').click()
      })

      after(() => {
        document.body.removeChild(document.getElementById('fixture'))
      })

      it(`It should add 'error' as a class to the .form-group`, () => {
        expect(document.getElementsByClassName('form-group')[0].classList.contains('error')).to.equal(true)
      })
      it(`It show the error message in the label`, () => {
        expect(document.getElementsByClassName('error-message')[0].innerHTML).to.equal(`This field cannot be blank`)
      })
      it(`It should show an error summary`, () => {
        expect(document.getElementById('error-summary')).to.exist
      })
      it(`The error summary should link to the errored input ‘${fixtures.inputId}’`, () => {
        expect(document.querySelector(`a[href="#${fixtures.inputId}"]`)).to.exist
      })
      it(`The error summary should link text should be ‘${fixtures.label}’`, () => {
        expect(document.querySelector(`a[href="#${fixtures.inputId}"]`).innerHTML).to.equal(`${fixtures.label}`)
      })
    })
  })
})
