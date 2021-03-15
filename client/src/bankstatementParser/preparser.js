const { removeEmptyLines } = require('./helpermethods.js')

// Method for preparsing text from pdfs
// Will parse most of the unneseccary information leaving only the transactions
// This is a bit of what we call in finnish "purkka", but it seems to work fine :')
// The beginning of the pdf can be removed by first parsing
// Then all the page changes in the middle of the pdf can be removed with the while loop
// Then the last page will be parsed with the last parse
const preParse = (initialText) => {
  let start = 0

  // console.log(initialText)

  // first page
  let parsedText = initialText.substring(
    initialText.indexOf('KIRJAUSPÄIVÄ') + 13,
    (start = initialText.indexOf('SIIRTO'))
  )
  parsedText = parsedText.trim()
  start += 7

  // pages 2 - n-1
  while (initialText.indexOf('SIIRTO', start) !== -1) {
    const part1 = initialText.substring(
      initialText.indexOf('2181702-8', start) + 10,
      (start = initialText.indexOf('SIIRTO', start))
    )
    start += 7
    parsedText = parsedText.concat(part1)
  }

  // page n
  const part1 = initialText.substring(initialText.indexOf('2181702-8', start) + 10)
  parsedText = parsedText.concat(part1)

  parsedText = removeEmptyLines(parsedText)

  return parsedText
}

module.exports = preParse
