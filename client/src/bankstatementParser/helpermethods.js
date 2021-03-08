const removeExtraWhiteSpace = (string) => string.replace(/\s+/g, ' ')

const removeEmptyLines = (string) => string.replace(/^\s*[\r\n]/gm, '')

module.exports = {
  removeEmptyLines,
  removeExtraWhiteSpace,
}
