'use strict'

const removeArticles = require('./remove-indefinite-articles')

describe('When a string is passed through the Nunjucks removeIndefiniteArticles filter', () => {
  it('it should remove indefinite articles (a/an)', () => {
    expect(removeArticles('Pay for a thing')).toEqual('Pay for thing')
  })
  it('it should remove indefinite articles (the)', () => {
    expect(removeArticles('The Private Office of Jon Heslop')).toEqual('Private Office of Jon Heslop')
  })
})
