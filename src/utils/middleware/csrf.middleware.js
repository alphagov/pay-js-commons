const csrf = require('csrf')

class CsrfError extends Error {
  constructor (message) {
    super(message)
    this.name = 'CsrfError'
  }
}

/**
 * @param logger {Logger}
 * @param sessionName {string} the name of the object on the request where the secret key will be stored
 * @param secretName {string} the name of the key in session object that will hold the secret value
 * @param tokenName {string} the name of the key on the request body/query that will hold the token value
 */
const configureCsrfMiddleware = (logger, sessionName, secretName = 'csrfSecret', tokenName = 'csrfToken') => {
  logger.debug('--- CSRF middleware configuration ---')
  logger.debug(`Secret is set at req['${sessionName}']['${secretName}']`)
  logger.debug(`Token is checked at req.body|query['${tokenName}']`)
  logger.debug('-------------------------------------')

  /**
   * @param req {e.Request}
   * @param res {e.Response}
   * @param next {e.NextFunction}
   */
  const setSecret = (req, res, next) => {
    const csrfSecret = req[sessionName]?.[secretName]
    if (!csrfSecret) {
      logger.debug('Synchronising CSRF secret')
      req[sessionName][secretName] = csrf().secretSync()
    }
    next()
  }

  /**
   * @param req {e.Request}
   * @param res {e.Response}
   * @param next {e.NextFunction}
   */
  const checkToken = (req, res, next) => {
    // short circuit the check if method is not PUT/POST
    if (!['PUT', 'POST'].includes(req.method.toUpperCase())) {
      return next()
    }
    const csrfSecret = req[sessionName]?.[secretName]
    const csrfToken = req.body?.[tokenName] || req.query?.[tokenName]
    if (!csrfSecret) {
      return next(new CsrfError(`CSRF secret was not found on ${sessionName} when validating token`))
    }
    if (!csrfToken) {
      return next(new CsrfError('CSRF token was not found in body or query for PUT/POST request'))
    }
    if (!csrf().verify(csrfSecret, csrfToken)) {
      return next(new CsrfError('Invalid CSRF token'))
    }
    next()
  }

  /**
   * @param req {e.Request}
   * @param res {e.Response}
   * @param next {e.NextFunction}
   */
  const generateToken = (req, res, next) => {
    const csrfSecret = req[sessionName][secretName]
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
  configureCsrfMiddleware,
  CsrfError
}
