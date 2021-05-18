const fs = require('fs')
const Cookies = require('js-cookie')

// eslint-disable-next-line node/no-path-concat
const template = fs.readFileSync(`${__dirname}/banner.html`, 'utf-8')

const GOVUK_PAY_ANALYTICS_CONSENT_COOKIE_NAME = 'govuk_pay_cookie_policy'
const ANALYTICS_CONSENT_BANNER_ID = 'pay-cookie-banner'

function hasAnalyticsConsent () {
  const cookie = Cookies.get(GOVUK_PAY_ANALYTICS_CONSENT_COOKIE_NAME)
  const parsed = cookie && JSON.parse(cookie)
  return Boolean(parsed) && parsed.analytics === true
}

function getCookieDomain () {
  const PROD_HOSTNAME = 'payments.service.gov.uk'

  if (window.location.hostname.includes(PROD_HOSTNAME)) {
    return PROD_HOSTNAME
  }

  return undefined
}

function setAnalyticsCookie (userConsentedToAnalytics = false) {
  const cookieValue = JSON.stringify({ analytics: userConsentedToAnalytics })
  const cookieAttributes = {
    expires: 365,
    path: '/',
    domain: getCookieDomain()
  }
  Cookies.set(GOVUK_PAY_ANALYTICS_CONSENT_COOKIE_NAME, cookieValue, cookieAttributes)
}

function hideBannerIfExists (event) {
  const banner = document.querySelector(`#${ANALYTICS_CONSENT_BANNER_ID}`)
  if (banner) {
    banner.style.display = 'none'
  }

  if (event.target) {
    event.preventDefault()
  }
}

function showConfirmationMessage (analyticsConsent) {
  const messagePrefix = analyticsConsent
    ? 'You’ve accepted analytics cookies.'
    : 'You told us not to use analytics cookies.'

  const $cookieBannerMainContent = document.querySelector(
    '.pay-cookie-banner__wrapper'
  )

  const $cookieBannerConfirmationMessage = document.querySelector(
    '.pay-cookie-banner__confirmation-message'
  )

  $cookieBannerConfirmationMessage.prepend(messagePrefix)

  $cookieBannerMainContent.style.display = 'none'

  const $cookieBannerConfirmationWrapper = document.querySelector('.pay-cookie-banner__confirmation')
  $cookieBannerConfirmationWrapper.style.display = 'block'
}

function acceptAnalyticsCookies () {
  setAnalyticsCookie(true)
  showConfirmationMessage(true)
}

function rejectAnalyticsCookies () {
  setAnalyticsCookie(false)
  showConfirmationMessage(false)
}

function createBannerHTMLElement (consentProvidedCallback = () => {}) {
  const banner = document.createElement('div')
  banner.id = ANALYTICS_CONSENT_BANNER_ID
  banner.innerHTML = template.trim()

  const acceptButton = banner.querySelector('button[data-accept-cookies=true]')
  const rejectButton = banner.querySelector('button[data-accept-cookies=false]')

  if (acceptButton && rejectButton) {
    acceptButton.addEventListener('click', acceptAnalyticsCookies)
    acceptButton.addEventListener('click', consentProvidedCallback)
    rejectButton.addEventListener('click', rejectAnalyticsCookies)
  }

  const hideCookieBannerLink = banner.querySelector('button[data-hide-cookie-banner]')

  if (hideCookieBannerLink) {
    hideCookieBannerLink.addEventListener('click', hideBannerIfExists)
  }

  return banner
}

/**
 * ConsentProvidedCallback: function - generic callback that will be called
 *                                     if and only if the user provides consent
 */
function showBannerIfConsentNotSet (consentProvidedCallback = () => {}) {
  const consentCookieNotSet = !Cookies.get(GOVUK_PAY_ANALYTICS_CONSENT_COOKIE_NAME)
  const banner = document.querySelector(`#${ANALYTICS_CONSENT_BANNER_ID}`)

  if (consentCookieNotSet && !banner) {
    const banner = createBannerHTMLElement(consentProvidedCallback)
    document.body.prepend(banner)
  }
}

module.exports = { hasAnalyticsConsent, showBannerIfConsentNotSet }
