[![Build Status](https://travis-ci.org/alphagov/pay-js-commons.svg?branch=master)](https://travis-ci.org/alphagov/pay-js-commons)


# pay-js-commons
Reusable js scripts for GOV.UK Pay Node.js projects

- [Browsered scripts](#browsered-scripts)
- [Utilities](#utilities)

## Browsered scripts
This is a colection of client side scripts we use throught the GOV.UK 
Pay in the browser. We call it browsered because they are written in 
Node.js and _browsered_ by Browserify to make them safe for all our 
browsers. We browserify [within the microservice when it’s compiled](https://github.com/alphagov/pay-selfservice/blob/master/Gruntfile.js#L128).

#### List of scripts
- [Field validation](#field-validation)

### Field Validation
This is a collection of validators that can be applied to inputs that
will check the values and display errors using the [GOV.UK elements styling](https://govuk-elements.herokuapp.com/errors/#summarise-errors).

Validators:
- [required](#required)
- [currency](#currency)
- [email](#email)
- [phone](#phone)
- [https](#https)
- [belowMaxAmount](#number-is-less-than-maximum-value)
- [passwordLessThanTenChars](#password)
- [isFieldGreaterThanMaxLengthChars](#maximum-character-limit)
- [isNaxsiSafe](#isNaxsiSafe)

#### Required
This requires a value from a given input

```html
<form data-validate>
  <div class="govuk-form-group">
    <label for="name">Your name</label>
    <input name="name" data-validate="required" value="" />
  </div>
</form>
```

#### Currency
This requires the value is a valid currency amount i.e. “10” or ”9.99”.

```html
<form data-validate>
  <div class="govuk-form-group">
    <label for="amount">Amount</label>
    <input name="amount" data-validate="required currency" value="" />
  </div>
</form>
```

#### Email
This requires the value is a valid email address with a [TLD](https://en.wikipedia.org/wiki/Top-level_domain) on the end (as [technically](https://www.ietf.org/rfc/rfc822.txt) an email doesn’t need one).

```html
<form data-validate>
  <div class="govuk-form-group">
    <label for="email">Your email address</label>
    <input name="email" data-validate="email" value="" />
  </div>
</form>
```

#### Phone
This requires the value is a 11 digit phone number, it isn’t concerned
with spacing, so `077 777 777 77` and `07777777777` are both valid.

```html
<form data-validate>
  <div class="govuk-form-group">
    <label for="phone">Phone number</label>
    <input name="phone" data-validate="phone" value="" />
  </div>
</form>
```

#### HTTPS
This requires a link to begin with https://

```html
<form data-validate>
  <div class="govuk-form-group">
    <label for="url">Return URL</label>
    <input name="url" data-validate="https" value="" />
  </div>
</form>
```

#### Number is less than maximum value
This requires the value is less than £100,000 as that has been deemed sensible…

```html
<form data-validate>
  <div class="govuk-form-group">
    <label for="price">Amount</label>
    <input name="price" data-validate="belowMaxAmount" value="" />
  </div>
</form>
```

#### Password
This requires a password be at least 10 chars

```html
<form data-validate>
  <div class="govuk-form-group">
    <label for="password">Password</label>
    <input name="password" data-validate="passwordLessThanTenChars" value="" />
  </div>
</form>
```

#### Maximum character limit
This requires a value be less than a certain number of characters. This limit
is set within a `data-attribute`

```html
<form data-validate>
  <div class="govuk-form-group">
    <label for="title">Title</label>
    <input name="title" data-validate="isFieldGreaterThanMaxLengthChars" data-validate-max-length="255" value="" />
  </div>
</form>
```

#### Maximum character limit
This checks whether a field contains characters than would cause NAXSI to get upset
i.e. ``< > ; : ` ( ) " \' = | , ~ [ ]``

```html
<form data-validate>
  <div class="govuk-form-group">
    <label for="title">Title</label>
    <input name="title" data-validate="isNaxsiSafe" value="" />
  </div>
</form>
```
