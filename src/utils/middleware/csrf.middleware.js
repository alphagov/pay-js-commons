const csrf = require('csrf')

/**
 * @param logger {Logger}
 * @param sessionKey {string}
 * @param secretKey {string}
 * @param tokenKey {string}
 */
const configureCsrfMiddleware = (logger, sessionKey, secretKey = 'csrfSecret', tokenKey = 'csrfToken') => {
  logger.debug('--- CSRF middleware configuration ---')
  logger.debug(`Secret is set at req.[${sessionKey}][${secretKey}]`)
  logger.debug(`Token is checked at req.body|query[${tokenKey}]`)
  logger.debug('-------------------------------------')
  /**
   * @param csrfToken {string}
   * @param csrfSecret {string}
   * @param req {e.Request}
   */
  const csrfValid = (csrfToken, csrfSecret, req) => {
    if (!csrfSecret) {
      logger.debug('CSRF secret not found when validating token')
      return false
    }
    if (!['put', 'post'].includes(req.method.toLowerCase())) {
      return true
    }
    return csrf().verify(csrfSecret, csrfToken)
  }

  /**
   * @param req {e.Request}
   * @param res {e.Response}
   * @param next {e.NextFunction}
   */
  const setSecret = (req, res, next) => {
    const csrfSecret = req[sessionKey][secretKey]
    if (!csrfSecret) {
      logger.debug('Synchronising CSRF secret')
      req[sessionKey][secretKey] = csrf().secretSync()
    }
    next()
  }

  /**
   * @param req {e.Request}
   * @param res {e.Response}
   * @param next {e.NextFunction}
   */
  const checkToken = (req, res, next) => {
    const csrfSecret = req[sessionKey][secretKey]
    const csrfToken = (req.body && req.body[tokenKey]) || (req.query && req.query[tokenKey])
    if (!csrfValid(csrfToken, csrfSecret, req)) {
      next(new Error('Invalid CSRF token'))
    } else {
      next()
    }
  }

  /**
   * @param req {e.Request}
   * @param res {e.Response}
   * @param next {e.NextFunction}
   */
  const generateToken = (req, res, next) => {
    const csrfSecret = req[sessionKey][secretKey]
    res.locals.csrf = csrf().create(csrfSecret)
    next()
  }

  return {
    setSecret,
    checkToken,
    generateToken
  }
}

module.exports = {
  configureCsrfMiddleware
}
