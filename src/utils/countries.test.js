const countries = require('./countries')

describe('countries', () => {
  describe('retrieveCountries', () => {
    it('should list of countries ordered', () => {
      const retrievedCountries = countries.retrieveCountries()

      expect(retrievedCountries[0].entry.country).toEqual('AF')
      expect(retrievedCountries[1].entry.country).toEqual('AL')
    })

    it('should select only the correct country', () => {
      const retrievedCountries = countries.retrieveCountries('CH')
      const selectedCountries = retrievedCountries.filter(country => country.entry.selected === true)
      expect(selectedCountries.length).toEqual(1)
      expect(selectedCountries[0].entry.country).toEqual('CH')
    })

    it('should select GB by default', () => {
      const retrievedCountries = countries.retrieveCountries()
      const selectedCountries = retrievedCountries.filter(country => country.entry.selected === true)
      expect(selectedCountries.length).toEqual(1)
      expect(selectedCountries[0].entry.country).toEqual('GB')
    })
  })

  describe('translateAlpha2', () => {
    it('should translate country code to name', () => {
      expect(countries.translateAlpha2('GB')).toEqual('United Kingdom')
    })

    it('should return undefined when an invalid country code is used', () => {
      expect(countries.translateAlpha2('ZZ')).toEqual(undefined)
    })

    it('should return undefined when no country code is used', () => {
      expect(countries.translateAlpha2()).toEqual(undefined)
    })
  })
})
