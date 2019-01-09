// Removes indefinite articles (a/an)
// Removes definite articles (the)

module.exports = string => {
  return string.replace(/\ba\s|\ban\s|\bthe\s/gi, '')
}
