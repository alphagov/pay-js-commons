const slugify = require('slugify')

module.exports = string => {
  slugify.extend({
    ŵ: 'w',
    ẁ: 'w',
    ẃ: 'w',
    ẅ: 'w',
    ŷ: 'y',
    ỳ: 'y',
    ý: 'y',
    ÿ: 'y',
    Ŵ: 'W',
    Ẁ: 'W',
    Ẃ: 'W',
    Ẅ: 'W',
    Ŷ: 'Y',
    Ỳ: 'Y',
    Ý: 'Y',
    Ÿ: 'Y'
  })
  return slugify(
    string,
    {
      remove: /[^A-Za-z0-9\s-]/g,
      lower: true
    }
  )
}
