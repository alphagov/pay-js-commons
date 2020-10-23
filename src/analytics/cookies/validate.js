const fs = require('fs')
const Cookies = require('js-cookie')

// eslint-disable-next-line node/no-path-concat
const template = fs.readFileSync(`${__dirname}/banner.html`, 'utf-8')

const GOVUK_PAY_ANALYTICS_CONSENT_COOKIE_NAME = 'govuk_pay_cookie_policy'
const ANALYTICS_CONSENT_BANNER_ID = 'pay-cookie-banner'

function hasAnalyticsConsent() {
  const cookie = Cookies.get(GOVUK_PAY_ANALYTICS_CONSENT_COOKIE_NAME)
  const parsed = cookie && JSON.parse(cookie)
  return Boolean(parsed) && parsed.analytics === true
}

function isLocalDomain() {
  return ['localhost', '127.0.0.1', ''].includes(window.location.hostname)
}

function getCookieDomain() {
  return window.location.hostname.replace(/^www\./, '')
}

function setAnalyticsCookie(userConsentedToAnalytics = false) {
  const cookieValue = JSON.stringify({ analytics: userConsentedToAnalytics })
  const cookieAttributes = {
    expires: 365,
    path: '/',
    domain: isLocalDomain() ? undefined : getCookieDomain()
  }
  Cookies.set(GOVUK_PAY_ANALYTICS_CONSENT_COOKIE_NAME, cookieValue, cookieAttributes)
}

function hideBannerIfExists() {
  const banner = document.querySelector(`#${ANALYTICS_CONSENT_BANNER_ID}`)
  if (banner) {
    banner.style.display = 'none'
  }
}

function acceptAnalyticsCookies() {
  setAnalyticsCookie(true)
  hideBannerIfExists()
}

function rejectAnalyticsCookies() {
  setAnalyticsCookie(false)
  hideBannerIfExists()
}

function createBannerHTMLElement(consentProvidedCallback = () => {}) {
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

  return banner
}

/**
 * ConsentProvidedCallback: function - generic callback that will be called
 *                                     if and only if the user provides consent
 */
function showBannerIfConsentNotSet(consentProvidedCallback = () => {}) {
  const consentCookieNotSet = !Cookies.get(GOVUK_PAY_ANALYTICS_CONSENT_COOKIE_NAME)
  const banner = document.querySelector(`#${ANALYTICS_CONSENT_BANNER_ID}`)

  if (consentCookieNotSet && !banner) {
    const banner = createBannerHTMLElement(consentProvidedCallback)
    document.body.prepend(banner)
  }
}

module.exports = { hasAnalyticsConsent, showBannerIfConsentNotSet }
