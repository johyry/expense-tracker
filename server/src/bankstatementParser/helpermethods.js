const removeExtraWhiteSpace = (string) => string.replace(/\s+/g, ' ')

const removeEmptyLines = (string) => string.replace(/^\s*[\r\n]/gm, '')

const parseMonthAndYear = (text) => {
  const dateText = text.substring(
    text.indexOf('SALDO') + 6,
    text.indexOf('SALDO') + 16,
  )

  const month = Number(dateText.substring(3, 5))
  const year = Number(dateText.substring(6, 10))

  return { month, year }
}

module.exports = {
  removeEmptyLines,
  removeExtraWhiteSpace,
  parseMonthAndYear,
}
