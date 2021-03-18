const fs = require('fs')
const pdf = require('pdf-parse')
const preParse = require('./preparser.js')
const parseTransaction = require('./transactionparser.js')
const { parseMonthAndYear } = require('./helpermethods')

const parser = async (pathToFile) => {
  const dataBuffer = fs.readFileSync(pathToFile)

  const data = await pdf(dataBuffer)

  const monthAndYear = parseMonthAndYear(data.text)
  let events = preParse(data.text)

  events = events.split('FT')

  const lengths = new Map()
  const payments = []

  Object.entries(events).forEach((a) => {
    const lines = a[1].split('\n')

    if (lines.length > 1) {
      const payment = parseTransaction(lines, monthAndYear)
      if (payment) payments.push(payment)
    }

    if (lengths.has(lines.length)) {
      lengths.set(lines.length, lengths.get(lines.length) + 1)
    } else {
      lengths.set(lines.length, 1)
    }
  })

  return payments
}

module.exports = {
  parser,
}
