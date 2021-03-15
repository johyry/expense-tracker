const fs = require('fs')
const pdf = require('pdf-parse')
const preParse = require('./preparser.js')
const parseTransaction = require('./transactionparser.js')

const parser = () => {
  const dataBuffer = fs.readFileSync('./examplePdfs/Tiliote_1-2.pdf')
  console.log(dataBuffer)

  pdf(dataBuffer).then((data) => {
    let events = preParse(data.text)

    events = events.split('FT')
    // console.log(events)

    const lengths = new Map()
    const payments = []

    Object.entries(events).forEach((a) => {
      const lines = a[1].split('\n')

      if (lines.length > 1) {
        const payment = parseTransaction(lines)
        if (payment) payments.push(payment)
      } else {
        console.log('LENGTH < 1', lines)
      }

      if (lengths.has(lines.length)) {
        lengths.set(lines.length, lengths.get(lines.length) + 1)
      } else {
        lengths.set(lines.length, 1)
      }
    })
    // const sortedMap = new Map([...lengths.entries()].sort())
    // console.log(sortedMap)

    // console.log(payments)
    // console.log(payments.length)
  })
}

const test = (file) => {
  const dataBuffer = fs.readFile(file)
  pdf(dataBuffer).then((data) => {
    console.log(data.text)
  })
}

module.exports = {
  parser,
  test,
}

parser()
