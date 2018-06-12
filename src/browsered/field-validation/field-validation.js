'use strict'

// NPM Dependencies
const every = require('lodash/every')

// Local Dependencies
const checks = require('../../utils/field-validation-checks')

exports.enableFieldValidation = () => {
  const allForms = Array.prototype.slice.call(document.getElementsByTagName('form'))

  allForms.filter(form => {
    return form.hasAttribute('data-validate')
  }).map(form => {
    return form.addEventListener('submit', initValidation, false)
  })
}

function initValidation(e) {
  const form = e.target
  e.preventDefault()
  clearPreviousErrors()

  const validatedFields = findFields(form).map(field => validateField(form, field))

  if (every(validatedFields)) {
    form.submit()
  } else {
    populateErrorSummary(form)
  }
}

function clearPreviousErrors() {
  const previousErrorsMessages = Array.prototype.slice.call(document.querySelectorAll('.error-message, .error-summary'))
  const previousErrorsFields = Array.prototype.slice.call(document.querySelectorAll('.form-group.error'))

  previousErrorsMessages.map(error => error.remove())
  previousErrorsFields.map(errorField => errorField.classList.remove('error'))
}

function findFields(form) {
  const formFields = Array.prototype.slice.call(form.querySelectorAll('input, textarea, select'))

  return formFields.filter(field => {
    return field.hasAttribute('data-validate')
  })
}

function validateField(form, field) {
  let result
  const validationTypes = field.getAttribute('data-validate').split(' ')

  validationTypes.forEach(validationType => {
    switch (validationType) {
      case 'required':
        result = checks.isEmpty(field.value)
        break
      case 'currency':
        result = checks.isCurrency(field.value)
        break
      case 'email':
        result = checks.isValidEmail(field.value)
        break
      case 'phone':
        result = checks.isPhoneNumber(field.value)
        break
      case 'https':
        result = checks.isHttps(field.value)
        break
      case 'belowMaxAmount':
        result = checks.isAboveMaxAmount(field.value)
        break
      case 'passwordLessThanTenChars':
        result = checks.isPasswordLessThanTenChars(field.value)
        break
      case 'isFieldGreaterThanMaxLengthChars':
        result = checks.isFieldGreaterThanMaxLengthChars(field.value, field.getAttribute('data-validate-max-length'))
        break
      case 'isNaxsiSafe':
        result = checks.isNaxsiSafe(field.value)
        break
      default:
        result = false
        break
    }
    if (result) {
      applyErrorMessaging(form, field, result)
    }
  })

  return !field.closest('.form-group').classList.contains('error')
}

function applyErrorMessaging(form, field, result) {
  const formGroup = field.closest('.form-group')
  if (!formGroup.classList.contains('error')) {
    formGroup.classList.add('error')
    document.querySelector('label[for="' + field.id + '"]').insertAdjacentHTML('beforeend',
      '<span class="error-message">' + result + '</span>')
  }
}

function populateErrorSummary(form) {
  const erroringFields = Array.prototype.slice.call(form.querySelectorAll('.form-group.error label'))
  const errorMessages = erroringFields.map(field => {
    const id = field.getAttribute('for')
    const label = field.innerHTML.split('<')[0].trim()
    return {label, id}
  })

  form.parentNode.insertAdjacentHTML(
    'afterbegin',
    `<div id="error-summary" class="error-summary" role="group" aria-labelledby="error-summary-heading" tabindex="-1">
      <h2 class="heading-medium error-summary-heading" id="error-summary-heading">
        There was a problem with the details you gave for:
      </h2>
      <ul class="error-summary-list">
        ${errorMessages.map(message => `<li class="error-${message.id}"><a href="#${message.id}">${message.label}</a></li>`).join('')}
      </ul>
    </div>`
  )
  window.scroll(0, 0)
}
