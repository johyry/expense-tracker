const fs = require('fs')
const pdf = require('pdf-parse')

const parser = () => {
  const dataBuffer = fs.readFileSync('./examplePdfs/Tiliote_1-3.pdf')

  pdf(dataBuffer).then((data) => {
    const events = data.text.split('FT')

    const lengths = new Map()
    const payments = []

    Object.entries(events).forEach((a) => {
      const lines = a[1].split('\n')

      if (lines.length < 9 && lines.length > 1) {
        const payment = handleParse(lines)
        if (payment) payments.push(payment)
      } else {
        console.log(lines)
      }

      if (lengths.has(lines.length)) {
        lengths.set(lines.length, lengths.get(lines.length) + 1)
      } else {
        lengths.set(lines.length, 1)
      }
    })
    const sortedMap = new Map([...lengths.entries()].sort())
    console.log(sortedMap)

    console.log(payments)
  })
}

// Typical examples of payments
// They will be forwarded to according parser based on their type
// 209 = card payment
// 236 = bank service charge
// 213 = sent bank transfer
// 113 = received bank transfer
// 256 = web payment

// '21057J49MQ        K  0226                                        53                                35.23 -',
//   '                             209 Korttiosto',
//   '                             S MARKET NIHTISILTA',
//   '                             ESPOO FI',
//   '                             <CARD DETAILS>,
//   '                             20210225',
//   ''

// '21054W40DC        A  0223                                        47                                 5.00 -',
//   '                             236 Palvelumaksu',
//   '                             HELSFIHHXXX',
//   '                             KÄYTTÖ- JA PALV.MAKS. 01/2021',
//   '                             Alv-% 0,00',
//   '                             ETUASIAKKUUSPAKETTI 5,00',
//   ''

// '21040G864D        A  0209  Helsingin seudun opiskelija-asunto    18                               672.00 -',
//   '                             213 Tilisiirto',
//   '                             FI6380001270163414',
//   '                             3550363550375',
//   '                             DABAFIHHXXX',
//   ''

// '21049DV9P2        K  0218  MobilePay Veikko Vastaanottaja    39                                44.00 +',
// '                             113 Tilisiirto',
// '                             MAKSAJAN VIITE',
// '                             XXXXX',
// '                             XXXXX',
// '                             XXXXX',
// ''

// '21040KWFHP        A  0209  Elisa Oyj                             20                                23.86 -',
// '                             256 Verkkomaksu',
// '                             FI0340551120048636',
// '                             XXXXX',
// '                             XXXXX',
// 'KIRJAUSPÄIVÄ 10.02.2021',
// ''

const handleParse = (array) => {
  // checking out the type of payment and forwarding to according type method
  let typeLine = removeExtraWhiteSpace(array[1])
  typeLine = typeLine.split(' ')
  const type = typeLine[1]

  if (type === '209') {
    return handleCardPayment(array)
  }

  if (type === '236') {
    return handleBankServiceCharge(array)
  }

  if (type === '113' || type === '213') {
    return handleBankTransfer(array)
  }

  if (type === '256') {
    return handleWebPayment(array)
  }
}

// '21057J49MQ        K  0226                                        53                                35.23 -',
//   '                             209 Korttiosto',
//   '                             S MARKET NIHTISILTA',
//   '                             ESPOO FI',
//   '                             <CARD DETAILS>,
//   '                             20210225',
//   ''
const handleCardPayment = (array) => {
  const sum = parseSum(array[0])
  const type = 'Korttiosto'
  const date = parseDate(array[0])
  const shop = parseShop(array[2])
  const location = parseLocation(array[3])

  const payment = {
    sum,
    type,
    date,
    shop,
    location,
  }
  return payment
}

// '21054W40DC        A  0223                                        47                                 5.00 -',
//   '                             236 Palvelumaksu',
//   '                             HELSFIHHXXX',
//   '                             KÄYTTÖ- JA PALV.MAKS. 01/2021',
//   '                             Alv-% 0,00',
//   '                             ETUASIAKKUUSPAKETTI 5,00',
//   ''
const handleBankServiceCharge = (array) => {
  const sum = parseSum(array[0])
  const type = 'Palvelumaksu'
  const date = parseDate(array[0])
  const shop = parseShop(array[3])

  const payment = {
    sum,
    type,
    date,
    shop,
  }

  return payment
  // console.log(payment)
}

// '21049DV9P2        K  0218  MobilePay Veikko Vastaanottaja    39                                44.00 +',
// '                             113 Tilisiirto',
// '                             MAKSAJAN VIITE',
// '                             XXXXX',
// '                             XXXXX',
// '                             XXXXX',
// ''
const handleBankTransfer = (array) => {
  const sum = parseSum(array[0])
  const type = 'Tilisiirto'
  const date = parseDate(array[0])
  const receiverOrSender = parseBankTransferReceiver(array[0])

  const payment = {
    sum,
    type,
    date,
    receiverOrSender,
  }

  return payment
}

// '21040KWFHP        A  0209  Elisa Oyj                             20                                23.86 -',
// '                             256 Verkkomaksu',
// '                             FI0340551120048636',
// '                             XXXXX',
// '                             XXXXX',
// 'KIRJAUSPÄIVÄ 10.02.2021',
// ''
const handleWebPayment = (array) => {
  const sum = parseSum(array[0])
  const type = 'Verkkomaksu'
  const date = parseDate(array[0])
  const receiver = parseWebPaymentReceiver(array[0])

  const payment = {
    sum,
    type,
    date,
    receiver,
  }

  return payment
}

// Example
// '21057J49MQ        K  0226                                        53                                35.23 -',
const parseSum = (stringToParse) => {
  const parts = stringToParse.split(' ')
  let sum = Number(parts[parts.length - 2])
  if (parts[parts.length - 1] === '-') sum = -sum
  return sum
}

// Example
// '21057J49MQ        K  0226                                        53                                35.23 -',
const parseDate = (stringToParse) => {
  let parts = removeExtraWhiteSpace(stringToParse)
  parts = parts.split(' ')
  const date = parts[2]
  return date
}

// Example
//   '                             S MARKET NIHTISILTA',
const parseShop = (stringToParse) => {
  let shop = removeExtraWhiteSpace(stringToParse)
  shop = shop.trimLeft()
  return shop
}

// Example
//   '                             ESPOO FI',
const parseLocation = (stringToParse) => {
  const location = parseShop(stringToParse)
  return location
}

// EXAMPLES
// '21049DV9P2        K  0218  MobilePay Veikko Vastaanottaja    39                                44.00 +',
// '210429KFBT        K  0211  Hyry Matti Eemil Johannes             26                              900.00 -',
// '21040G864D        A  0209  Helsingin seudun opiskelija-asunto    18                               672.00 -',
//
//
//
// (1) Find the second occasion of only two empty spaces in row
// (2) Take the string starting from there until there is more than 4 empty spaces
// If there is a name with more than four empty spaces this method fails to completely parse the name
// Also I only had around 5 example cases of bank transfers and they all had >=4 empty spaces in end
// of the name, but this might not be the case in all occasions
const parseBankTransferReceiver = (stringToParse) => {
  let startOfReceiver = 0
  let endOfReceiver = 0
  let emptySpaces = 0
  let twoEmptySpacesInRow = 0
  for (let i = 0; i < stringToParse.length; i += 1) {
    if (stringToParse.charAt(i) === ' ') emptySpaces += 1
    if (stringToParse.charAt(i) !== ' ') emptySpaces = 0
    if (emptySpaces === 2 && stringToParse.charAt(i + 1) !== ' ') twoEmptySpacesInRow += 1
    if (twoEmptySpacesInRow === 2) {
      startOfReceiver = i + 1
      break
    }
  }

  emptySpaces = 0
  for (let i = startOfReceiver; i < stringToParse.length; i += 1) {
    if (stringToParse.charAt(i) === ' ') emptySpaces += 1
    if (stringToParse.charAt(i) !== ' ') emptySpaces = 0
    if (emptySpaces === 4) {
      endOfReceiver = i - 3
      break
    }
  }

  return stringToParse.slice(startOfReceiver, endOfReceiver)
}

// Forwards it to parseBankTransferReceiver because their format is same
const parseWebPaymentReceiver = (stringToParse) => parseBankTransferReceiver(stringToParse)

const removeExtraWhiteSpace = (string) => string.replace(/\s+/g, ' ')

parser()
