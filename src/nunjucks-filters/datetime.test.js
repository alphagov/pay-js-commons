'use strict'

const dateTimeFilter = require('./datetime')

describe('When an ISO timestring is passed through the  Nunjucks date/time filter', () => {
  const isoDateString = '2017-12-11T17:15:47Z'

  it('it should output a full human readable date time', () => {
    expect(dateTimeFilter(isoDateString, 'full')).toEqual('11 December 2017 5:15:47pm GMT')
  })
  it('it should output a human readable date', () => {
    expect(dateTimeFilter(isoDateString, 'date')).toEqual('11/12/2017')
  })
  it('it should output a human readable long date', () => {
    expect(dateTimeFilter(isoDateString, 'datelong')).toEqual('11 December 2017')
  })
  it('it should output a human readable time', () => {
    expect(dateTimeFilter(isoDateString, 'time')).toEqual('17:15:47')
  })
  it('it should output a human readable date time with no seconds or timezone', () => {
    expect(dateTimeFilter(isoDateString, 'datetime')).toEqual('11 December 2017 17:15')
  })
})
