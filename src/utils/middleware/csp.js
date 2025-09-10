const { rateLimit } = require('express-rate-limit')

const hasSubstr = (lookUpStrings, targetString) => {
  return lookUpStrings.some(str => targetString.toLowerCase().includes(str.toLowerCase()))
}

const rateLimitMiddleware = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 10, // Limit each IP to 10 requests per window
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
})

const requestParseMiddleware = (maxPayloadBytes, express) => {
  return (req, res, next) => {
    if (req.is('application/json') || req.is('application/reports+json') || req.is('application/csp-report')) {
      express.json({
        type: ['application/json', 'application/reports+json', 'application/csp-report'],
        limit: maxPayloadBytes // limit body payload to maxPayloadBytes, validated prior to parsing
      })(req, res, next)
    } else {
      return res.status(400).end()
    }
  }
}

const detectErrorsMiddleware = (logger) => {
  return (err, req, res, next) => {
    if (err) {
      if (err.type === 'entity.too.large') logger.info('CSP violation request payload exceeds maximum size')
      if (err.type === 'entity.parse.failed') logger.info('CSP violation request payload did not match expected content type')
      return res.status(400).end()
    }
    next()
  }
}
const captureEventMiddleware = (ignoredStrings, logger, sentry) => {
  return (req, res) => {
    let reports = undefined
    if (Array.isArray(req.body) && req.body.length > 0) {
      reports = req.body.filter(report => report.type === 'csp-violation') // new style reporting-api, can be batched into multiple reports
    } else if (req.body['csp-report'] !== undefined) {
      reports = [{ body: req.body['csp-report'] }] // old style report-uri
    }

    const userAgent = req.headers['user-agent']
    if (reports !== undefined) {
      reports.forEach(report => {
        const body = report.body
        const blockedUri = body['blocked-uri'] ?? body['blockedURL']
        const violatedDirective = body['violated-directive'] ?? body['effectiveDirective'] // https://www.w3.org/TR/CSP3/#dom-securitypolicyviolationevent-violateddirective
        if (violatedDirective === undefined || blockedUri === undefined) {
          logger.info('CSP violation report is invalid')
          return res.status(400).end()
        } else {
          if (hasSubstr(ignoredStrings, blockedUri)) return res.status(204).end()
          sentry.captureEvent({
            message: `Blocked ${violatedDirective} from ${blockedUri}`,
            level: 'warning',
            extra: {
              cspReport: body,
              userAgent: userAgent
            }
          })
        }
      })
    } else {
      logger.info('CSP violation report missing')
      return res.status(400).end()
    }
    return res.status(204).end()
  }
}

module.exports = {
  rateLimitMiddleware,
  captureEventMiddleware,
  requestParseMiddleware,
  detectErrorsMiddleware
}
