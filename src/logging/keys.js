'use strict'

// This file needs to be kept in sync with its Java consociate
// https://github.com/alphagov/pay-java-commons/blob/master/logging/src/main/java/uk/gov/pay/logging/LoggingKeys.java

// "card", "Direct Debit"
exports.PAYMENT_TYPE = 'payment_type'

// "payment", "mandate", "refund"
exports.RESOURCE_TYPE = 'resource_type'

// "sandbox", "Worldpay", "Smartpay", "ePDQ", "Stripe", "GoCardless"
exports.PROVIDER = 'provider'

// The digital wallet used for a payment
// Value must be a value of the WalletType enum
// https://github.com/alphagov/pay-connector/blob/master/src/main/java/uk/gov/pay/connector/wallets/WalletType.java
exports.WALLET = 'wallet'

// The type of a gateway account
// Value must be a value of the GatewayAccountEntity.Type enum
// https://github.com/alphagov/pay-connector/blob/master/src/main/java/uk/gov/pay/connector/gatewayaccount/model/GatewayAccountEntity.java
exports.GATEWAY_ACCOUNT_TYPE = 'gateway_account_type'

// The type of operation being performed with a gateway for a card payment
// Value must be a value of the OperationType enum
// https://github.com/alphagov/pay-connector/blob/master/src/main/java/uk/gov/pay/connector/paymentprocessor/model/OperationType.java
exports.GATEWAY_CARD_OPERATION = 'gateway_card_operation'

// The amount of a payment in pence
exports.AMOUNT = 'amount'

// The ID GOV.UK Pay gives to a payment, mandate, refund etc.
exports.EXTERNAL_ID = 'external_id'

// The ID a provider gives to a payment, mandate, refund etc.
exports.PROVIDER_ID = 'provider_id'

// The ID a provider gives to an event (e.g. one in a notification)
exports.PROVIDER_EVENT_ID = 'provider_event_id'

// The reference a partner service assigns to a payment, mandate etc.
exports.SERVICE_PAYMENT_REFERENCE = 'service_reference'

// The ID GOV.UK Pay gives to a gateway account
exports.GATEWAY_ACCOUNT_ID = 'gateway_account_id'

// The ID of an event emitted to ledger
exports.LEDGER_EVENT_ID = 'ledger_event_id'

// The type of an event emitted to ledger
exports.LEDGER_EVENT_TYPE = 'ledger_event_type'

// The type of an internal event recorded by Direct Debit
// Value must be a value from the GovUkPayEventType enum
// https://github.com/alphagov/pay-direct-debit-connector/blob/master/src/main/java/uk/gov/pay/directdebit/events/model/GovUkPayEventType.java
exports.DIRECT_DEBIT_INTERNAL_EVENT_TYPE = 'direct_debit_internal_event_type'

// The current (or new if transitioning) internal state of a payment, mandate etc.
exports.CURRENT_INTERNAL_STATE = 'current_internal_state'

// The previous internal state of a payment, mandate etc. when transitioning
exports.PREVIOUS_INTERNAL_STATUS = 'previous_internal_status'

// The last event (status) that Worldpay recorded for a payment, refund etc.
exports.WORLDPAY_LAST_EVENT = 'worldpay_last_event'

// The result code (status) that Smartpay recorded for a payment, refund etc.
exports.SMARTPAY_RESULT_CODE = 'smartpay_result_code'

// The status code that ePDQ recorded for a payment, refund etc.
exports.EPDQ_STATUS = 'epdq_status'

// The status that Stripe recorded for a payment, refund etc.
exports.STRIPE_STATUS = 'stripe_status'

// The action that GoCardless recorded for a payment, mandate etc.
exports.GOCARDLESS_PAYMENT_ACTION = 'gocardless_action'

// The HTTP status we sent to a client
exports.HTTP_STATUS = 'http_status'

// The HTTP status code we received from a remote server (e.g. a payment provider)
exports.REMOTE_HTTP_STATUS = 'remote_http_status'

// AWS error code
exports.AWS_ERROR_CODE = 'aws_error_code'

// The correlation id for the request
exports.CORRELATION_ID = 'x_request_id'

// Payment External Id
exports.PAYMENT_EXTERNAL_ID = 'payment_external_id'

// Refund External Id
exports.REFUND_EXTERNAL_ID = 'refund_external_id'

// Secure Token
exports.SECURE_TOKEN = 'secure_token'
