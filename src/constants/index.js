'use strict'

/*
 Metadata Column constants match up those defined:
 https://github.com/alphagov/pay-java-commons/blob/master/model/src/main/java/uk/gov/pay/commons/model/charge/ExternalMetadata.java
 */
module.exports = {
  externalMetadata: {
    MAX_KEY_VALUE_PAIRS: 10,
    MIN_KEY_LENGTH: 1,
    MAX_KEY_LENGTH: 30,
    MAX_VALUE_LENGTH: 100
  },


  webhooks: {
    humanReadableSubscriptions: {
      /*
      Keys match those defined here:
      https://github.com/alphagov/pay-webhooks/blob/main/src/main/java/uk/gov/pay/webhooks/eventtype/EventTypeName.java
      */
      CARD_PAYMENT_STARTED: 'Payment started',
      CARD_PAYMENT_SUCCEEDED: 'Payment succeeded',
      CARD_PAYMENT_CAPTURED: 'Payment captured',
      CARD_PAYMENT_REFUNDED: 'Payment refunded'
    }
  }
}
