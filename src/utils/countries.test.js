const { expect } = require('chai')
const countries = require('./countries')

describe('countries', () => {
  it('should list of countries ordered', () => {
    const retrievedCountries = countries.retrieveCountries()

    expect(retrievedCountries[0].entry.country).to.eql('AF')
    expect(retrievedCountries[1].entry.country).to.eql('AL')
  })

  it('should translate country code to name', () => {
    expect(countries.translateAlpha2('GB')).to.eql('United Kingdom')
  })

  it('should select only the correct country', () => {
    const retrievedCountries = countries.retrieveCountries('CH')
    const selectedCountries = retrievedCountries.filter(country => country.entry.selected === true)
    expect(selectedCountries.length).to.be.eql(1)
    expect(selectedCountries[0].entry.country).to.eql('CH')
  })

  it('should select GB by default', () => {
    const retrievedCountries = countries.retrieveCountries()
    const selectedCountries = retrievedCountries.filter(country => country.entry.selected === true)
    expect(selectedCountries.length).to.be.eql(1)
    expect(selectedCountries[0].entry.country).to.eql('GB')
  })
})
