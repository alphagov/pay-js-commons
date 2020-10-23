/**
 * @jest-environment jsdom
 */

"use strict";
const JsCookie = require("js-cookie");
const validate = require("./validate")

describe("Cookie Banner", () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    JsCookie.remove("govuk_pay_cookie_policy");
    window.GovUkPay = window.GovUkPay || {};
    window.GovUkPay.InitAnalytics = {};
    window.GovUkPay.InitAnalytics.InitialiseAnalytics = jest.fn();
    // expire analytics cookie explictly, as cookies are not cleared in jest environment during the tests
    document.cookie = "govuk_pay_cookie_policy=;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.example.org";
  });

  describe("Existing User", () => {
      it(`should NOT see cookie banner but initialise analytics when cookie consent = true`, () => {
        expect(true).toEqual(true)
        JsCookie.set("govuk_pay_cookie_policy", "{\"analytics\": true}");
        validate.showBannerIfConsentNotSet()
        expect(document.querySelector("#pay-cookie-banner")).toEqual(null);
    });

    it(`should NOT see cookie banner and not initialise analytics when cookie consent = false`, () => {
          JsCookie.set("govuk_pay_cookie_policy", "{\"analytics\": false}");
          validate.showBannerIfConsentNotSet()
    
          expect(document.querySelector("#pay-cookie-banner")).toEqual(null);
        });
  });

  describe("New User", () => {
    it(`should see cookie banner when no consent cookie present`, () => {
      validate.showBannerIfConsentNotSet() 

      expect(document.querySelector("#pay-cookie-banner")).not.toEqual(null); 
    });

    it(`click YES on the cookie banner - sets consent cookie correctly`, () => {
        validate.showBannerIfConsentNotSet() 
        document.querySelector("button[data-accept-cookies=true]").click();
  
        const consentCookie = JsCookie.get("govuk_pay_cookie_policy");
        const consentCookieJson = JSON.parse(consentCookie);
        expect(consentCookieJson.analytics).toEqual(true);
    });

    it(`click YES on the cookie banner - fires Analytics`, () => {
        const mockFunction = jest.fn()  
        validate.showBannerIfConsentNotSet(mockFunction) 
        document.querySelector("button[data-accept-cookies=true]").click();
  
        expect(
          mockFunction.mock.calls.length
        ).toBe(1);
    });

    it(`click NO on the cookie banner - sets consent cookie correctly`, () => {
      validate.showBannerIfConsentNotSet()
      document.querySelector("button[data-accept-cookies=false]").click();

      const consentCookie = JsCookie.get("govuk_pay_cookie_policy");
      const consentCookieJson = JSON.parse(consentCookie);
      expect(consentCookieJson.analytics).toEqual(false);
    })

    it(`click NO on the cookie banner - does NOT fire Analytics`, () => {
      const mockFunction = jest.fn()  
      validate.showBannerIfConsentNotSet(mockFunction) 
      document.querySelector("button[data-accept-cookies=false]").click();

      expect(
        mockFunction.mock.calls.length
      ).toBe(0);
    })

    it(`click YES on the cookie banner - displays confirmation message`, () => {
        const mockFunction = jest.fn()  
        validate.showBannerIfConsentNotSet(mockFunction) 
      
        document.querySelector("button[data-accept-cookies=true]").click();
  
        const confirmBanner = document.querySelector(
          ".pay-cookie-banner__confirmation"
        );

        expect(confirmBanner.style.display).toEqual("block");
        
        expect(
          mockFunction.mock.calls.length
        ).toBe(1);
      });

    it(`click NO on the cookie banner - displays confirmation message`, () => {
      const mockFunction = jest.fn()  
      validate.showBannerIfConsentNotSet(mockFunction) 
    
      document.querySelector("button[data-accept-cookies=false]").click();

      const confirmBanner = document.querySelector(
        ".pay-cookie-banner__confirmation"
      );

      expect(confirmBanner.style.display).toEqual("block");
      
      expect(
        mockFunction.mock.calls.length
      ).toBe(0);
    });
  })

  describe("Confirmation mesage", () => {
      it(`hide button works`, () => {
      validate.showBannerIfConsentNotSet() 
    
      document.querySelector("button[data-accept-cookies=true]").click();

      const confirmBanner = document.querySelector(
        ".pay-cookie-banner__confirmation"
      );

      expect(confirmBanner.style.display).toEqual("block");

      confirmBanner.querySelector(".pay-cookie-banner__hide-button").click();
      const banner = document.querySelector('#pay-cookie-banner')
      expect(banner.style.display).toEqual("none");
    });
  });

  describe("hasAnalyticsConsent", () => {
    it(`return FALSE when no cookie present`, () => {
      const hasAnalyticsConsent = validate.hasAnalyticsConsent() 

      expect(hasAnalyticsConsent).toEqual(false);
    }); 

    it(`return TRUE when cookie present and consent = true`, () => {
      JsCookie.set("govuk_pay_cookie_policy", "{\"analytics\": true}");
      const hasAnalyticsConsent = validate.hasAnalyticsConsent() 

      expect(hasAnalyticsConsent).toEqual(true);
    }); 

    it(`return FALSE when cookie present and consent = false`, () => {
      JsCookie.set("govuk_pay_cookie_policy", "{\"analytics\": false}");
      const hasAnalyticsConsent = validate.hasAnalyticsConsent() 

      expect(hasAnalyticsConsent).toEqual(false);
    });
  })
});
