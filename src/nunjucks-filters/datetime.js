const moment = require('moment-timezone')

module.exports = (isoTimeString, format) => {
  let formatString = 'D MMMM YYYY h:mm:ssa z'
  if (format === 'date') {
    formatString = 'DD/MM/YYYY'
  } else if (format === 'datelong') {
    formatString = 'D MMMM YYYY'
  } else if (format === 'time') {
    formatString = 'HH:mm:ss'
  } else if (format === 'datetime') {
    formatString = 'D MMMM YYYY HH:mm'
  }
  return moment(isoTimeString).tz('Europe/London').format(formatString)
}
