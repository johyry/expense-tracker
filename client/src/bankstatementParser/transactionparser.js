const { removeExtraWhiteSpace } = require('./helpermethods.js')

// Typical examples of transactions
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
//   '                             XXXXX',
//   '                             XXXXX',
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
// '                             XXXXX',
// '                             XXXXX',
// '                             XXXXX',
// 'KIRJAUSPÄIVÄ 10.02.2021',
// ''

const parseTransaction = (array) => {
  // checking out the type of payment and forwarding to according type method
  let typeLine = removeExtraWhiteSpace(array[1])
  typeLine = typeLine.split(' ')
  const type = typeLine[1]

  let payment = {
    sum: parseSum(array[0]),
    date: parseDate(array[0]),
    monthlyTransactionId: parseId(array[0]),
  }

  if (type === '209') {
    return (payment = handleCardPayment(array, payment))
  }

  if (type === '236') {
    return (payment = handleBankServiceCharge(array, payment))
  }

  if (type === '113' || type === '213') {
    return (payment = handleBankTransfer(array, payment))
  }

  if (type === '256') {
    return (payment = handleWebPayment(array, payment))
  }

  if (type === '205') {
    return (payment = handleAtmWithdrawal(array, payment))
  }

  if (type === '127') {
    return (payment = handleLoanWithdrawal(array, payment))
  }
}

// '21057J49MQ        K  0226                                        53                                35.23 -',
//   '                             209 Korttiosto',
//   '                             S MARKET NIHTISILTA',
//   '                             ESPOO FI',
//   '                             XXXXX,
//   '                             XXXXX',
//   ''
const handleCardPayment = (array, payment) => {
  const type = 'Korttiosto'
  const shop = parseShop(array[2])
  const location = parseLocation(array[3])

  payment = {
    ...payment,
    type,
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
const handleBankServiceCharge = (array, payment) => {
  const type = 'Palvelumaksu'
  const shop = parseShop(array[3])

  payment = {
    ...payment,
    type,
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
const handleBankTransfer = (array, payment) => {
  const type = 'Tilisiirto'
  const receiverOrSender = parseBankTransferReceiver(array[0])

  payment = {
    ...payment,
    type,
    receiverOrSender,
  }

  return payment
}

// '21040KWFHP        A  0209  Elisa Oyj                             20                                23.86 -',
// '                             256 Verkkomaksu',
// '                             XXXXX',
// '                             XXXXX',
// '                             XXXXX',
// 'KIRJAUSPÄIVÄ 10.02.2021',
// ''
const handleWebPayment = (array, payment) => {
  const type = 'Verkkomaksu'
  const receiver = parseWebPaymentReceiver(array[0])

  payment = {
    ...payment,
    type,
    receiver,
  }

  return payment
}

// '2018503Y73        K  0703                                        9                                 20.00 -',
// '                             205 Automaattinosto Otto-autom.',
// '                             ATM Nosto 3445',
// '                             Espoo FI',
// '                             XXXXX',
// '                             XXXXX',
// ''
const handleAtmWithdrawal = (array, payment) => {
  const type = 'Automaattinosto'
  const location = parseLocation(array[3])

  payment = {
    ...payment,
    type,
    location,
  }

  return payment
}

// '20090ZY16F        K  0330  Aktia Pankki Oyj - Aktia Bank Abp     61                              12345.00 +',
//   '                             127 Lainan nosto',
//   '                             XXXXX',
//   '                             Luoton nosto 12345',
//   '                             XXXXX',
const handleLoanWithdrawal = (array, payment) => {
  const type = 'Lainan nosto'
  const lender = parseLoanLender(array[0])

  payment = {
    ...payment,
    type,
    lender,
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
// '210429KFBT        K  0211  Esimerkki Esa Pekka Joo             26                              900.00 -',
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

const parseLoanLender = (stringToParse) => parseBankTransferReceiver(stringToParse)

// '21040KWFHP        A  0209  Elisa Oyj                             20                                23.86 -',
const parseId = (stringToParse) => {
  stringToParse = removeExtraWhiteSpace(stringToParse)
  const parts = stringToParse.split(' ')
  return parts[parts.length - 3]
}

module.exports = parseTransaction
