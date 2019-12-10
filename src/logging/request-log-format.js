module.exports = (correlationIdHeader = 'x-request-id') => {
  const format = (tokens, req, res) => {
    return JSON.stringify({
      /* eslint-disable camelcase */
      remote_address: tokens['remote-addr'](req, res),
      remote_user: tokens['remote-user'](req, res),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      http_version: tokens['http-version'](req, res),
      status_code: tokens.status(req, res),
      content_length: tokens.res(req, res, 'content-length'),
      referrer: tokens.referrer(req, res),
      user_agent: tokens['user-agent'](req, res),
      response_time: `${tokens['response-time'](req, res)} ms`,
      x_request_id: tokens.req(req, res, correlationIdHeader)
      /* eslint-enable camelcase */
    })
  }

  return { format }
}
