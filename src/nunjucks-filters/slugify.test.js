'use strict'

const { expect } = require('chai')
const slugify = require('./slugify')

describe('When a string is passed through the Nunjucks slugify filter', () => {
  it('it should make it url friendly', () => {
    expect(slugify('Someönés*_+~.()\'"!:@?=,;{}/[]s string with-hyphen')).to.equal('someoness-string-with-hyphen')
  })

  it('should replace all Welsh accented vowels with unaccented characters', () => {
    expect(slugify('îïìíûùúüêèéëâàáäæåãôòóöœøyŷỳýÿŵẁẃẅ')).to.equal('iiiiuuuueeeeaaaaaeaaoooooeoyyyyywwww')
  })

  it('should replace capital Welsh accented vowels with lower case unaccented characters', () => {
    expect(slugify('ÎÏÌÍÛÙÚÜÊÈÉËÂÀÁÄÆÅÃÔÒÓÖŒØŶỲÝŸŴẀẂẄ')).to.equal('iiiiuuuueeeeaaaaaeaaoooooeoyyyywwww')
  })
})
