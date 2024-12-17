const { expect } = require('chai')
const { configureCsrfMiddleware, CsrfError } = require('./csrf.middleware')
const csrf = require('csrf')
const sinon = require('sinon')

describe('CSRF Middleware', () => {
  let mockLogger
  let middleware
  let mockReq
  let mockRes
  let mockNext

  beforeEach(() => {
    mockLogger = {
      debug: sinon.spy()
    }

    middleware = configureCsrfMiddleware(mockLogger, 'session', 'testSecret', 'testToken')

    mockReq = {
      session: {},
      method: 'GET',
      body: {},
      query: {}
    }

    mockRes = {
      locals: {}
    }

    mockNext = sinon.spy()
  })

  describe('setSecret', () => {
    it('should set CSRF secret if none exists', () => {
      middleware.setSecret(mockReq, mockRes, mockNext)

      expect(mockReq.session.testSecret).to.exist // eslint-disable-line
      expect(mockNext.calledOnce).to.be.true // eslint-disable-line
    })

    it('should not override existing CSRF secret', () => {
      const existingSecret = 'existing-secret' // pragma: allowlist secret
      mockReq.session.testSecret = existingSecret

      middleware.setSecret(mockReq, mockRes, mockNext)

      expect(mockReq.session.testSecret).to.equal(existingSecret)
      expect(mockNext.calledOnce).to.be.true // eslint-disable-line
    })
  })

  describe('checkToken', () => {
    beforeEach(() => {
      mockReq.session.testSecret = csrf().secretSync()
    })

    it('should allow GET requests without token', () => {
      mockReq.method = 'GET'

      middleware.checkToken(mockReq, mockRes, mockNext)

      expect(mockNext.calledOnce).to.be.true // eslint-disable-line
      expect(mockNext.args[0][0]).to.not.exist // eslint-disable-line
    })

    it('should allow HEAD requests without token', () => {
      mockReq.method = 'HEAD'

      middleware.checkToken(mockReq, mockRes, mockNext)

      expect(mockNext.calledOnce).to.be.true // eslint-disable-line
      expect(mockNext.args[0][0]).to.not.exist // eslint-disable-line
    })

    it('should reject POST requests without token', () => {
      mockReq.method = 'POST'

      middleware.checkToken(mockReq, mockRes, mockNext)

      expect(mockNext.calledWith(sinon.match.instanceOf(CsrfError))).to.be.true // eslint-disable-line
      expect(mockNext.args[0][0].message).to.equal('CSRF token was not found in body or query for PUT/POST request')
    })

    it('should reject PUT requests without token', () => {
      mockReq.method = 'PUT'

      middleware.checkToken(mockReq, mockRes, mockNext)

      expect(mockNext.calledWith(sinon.match.instanceOf(CsrfError))).to.be.true // eslint-disable-line
      expect(mockNext.args[0][0].message).to.equal('CSRF token was not found in body or query for PUT/POST request')
    })

    it('should accept valid token in request body', () => {
      mockReq.method = 'POST'
      mockReq.body.testToken = csrf().create(mockReq.session.testSecret)

      middleware.checkToken(mockReq, mockRes, mockNext)

      expect(mockNext.calledOnce).to.be.true // eslint-disable-line
      expect(mockNext.args[0][0]).to.not.exist // eslint-disable-line
    })

    it('should accept valid token in query string', () => {
      mockReq.method = 'POST'
      mockReq.query.testToken = csrf().create(mockReq.session.testSecret)

      middleware.checkToken(mockReq, mockRes, mockNext)

      expect(mockNext.calledOnce).to.be.true // eslint-disable-line
      expect(mockNext.args[0][0]).to.not.exist // eslint-disable-line
    })

    it('should reject invalid token', () => {
      mockReq.method = 'POST'
      mockReq.body.testToken = 'invalid-token'

      middleware.checkToken(mockReq, mockRes, mockNext)

      expect(mockNext.calledWith(sinon.match.instanceOf(CsrfError))).to.be.true // eslint-disable-line
      expect(mockNext.args[0][0].message).to.equal('Invalid CSRF token')
    })
  })

  describe('generateToken', () => {
    it('should generate token and set in res.locals', () => {
      mockReq.session.testSecret = csrf().secretSync()

      middleware.generateToken(mockReq, mockRes, mockNext)

      expect(mockRes.locals.csrf).to.exist // eslint-disable-line
      expect(typeof mockRes.locals.csrf).to.equal('string')
      expect(mockNext.calledOnce).to.be.true // eslint-disable-line
    })

    it('should generate valid token that passes verification', () => {
      mockReq.session.testSecret = csrf().secretSync()

      middleware.generateToken(mockReq, mockRes, mockNext)

      const generatedToken = mockRes.locals.csrf
      const isValid = csrf().verify(mockReq.session.testSecret, generatedToken)

      expect(isValid).to.be.true // eslint-disable-line
    })
  })
})
