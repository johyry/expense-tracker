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

const parseTransaction = (array, monthAndYear) => {
  // checking out the type of payment and forwarding to according typehandler method
  let typeLine = removeExtraWhiteSpace(array[1])
  typeLine = typeLine.split(' ')
  const type = typeLine[1]

  if (!type) return

  const payment = {
    bankId: parseId(array[0]),
    sum: parseSum(array[0]),
    date: new Date(
      monthAndYear.year,
      monthAndYear.month - 1,
      parseDay(array[0]),
    ),
    monthlyTransactionId: parseMonthlyId(array[0]),
    type: parseType(array[1]),
    category: 'Other',
  }

  if (type.includes('209')) {
    return handleCardPayment(array, payment)
  }

  if (type.includes('236')) {
    return handleBankServiceCharge(array, payment)
  }

  if (type.includes('113') || type.includes('213')) {
    return handleBankTransfer(array, payment)
  }

  if (type.includes('256')) {
    return handleWebPayment(array, payment)
  }

  if (type.includes('205')) {
    return handleAtmWithdrawal(array, payment)
  }

  if (type.includes('127')) {
    return handleLoanWithdrawal(array, payment)
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
  const shop = parseShop(array[2])
  const location = parseLocation(array[3])

  payment = {
    ...payment,
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
  const description = parseShop(array[3])

  payment = {
    ...payment,
    description,
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
  if (payment.type.includes('113')) {
    const sender = parseBankTransferReceiverOrSender(array[0])

    payment = {
      ...payment,
      sender,
    }
  }

  if (payment.type.includes('213')) {
    const receiver = parseBankTransferReceiverOrSender(array[0])

    payment = {
      ...payment,
      receiver,
    }
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
  const receiver = parseWebPaymentReceiver(array[0])

  payment = {
    ...payment,
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
  const location = parseLocation(array[3])

  payment = {
    ...payment,
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
  const lender = parseLoanLender(array[0])

  payment = {
    ...payment,
    lender,
  }

  return payment
}

//   '                             127 Lainan nosto',
const parseType = (stringToParse) => {
  let parts = removeExtraWhiteSpace(stringToParse)
  parts = parts.split(' ')
  parts.shift()
  return parts.join(' ')
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
const parseDay = (stringToParse) => {
  let parts = removeExtraWhiteSpace(stringToParse)
  parts = parts.split(' ')
  const day = parts[2].substring(2, 4)
  return day
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
const parseBankTransferReceiverOrSender = (stringToParse) => {
  let startOfReceiver = 0
  let endOfReceiver = 0
  let emptySpaces = 0
  let twoEmptySpacesInRow = 0
  for (let i = 0; i < stringToParse.length; i += 1) {
    if (stringToParse.charAt(i) === ' ') emptySpaces += 1
    if (stringToParse.charAt(i) !== ' ') emptySpaces = 0
    if (emptySpaces === 2 && stringToParse.charAt(i + 1) !== ' ') { twoEmptySpacesInRow += 1 }
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

// Forwards it to parseBankTransferReceiverOrSender because their format is same
const parseWebPaymentReceiver = (stringToParse) => parseBankTransferReceiverOrSender(stringToParse)

const parseLoanLender = (stringToParse) => parseBankTransferReceiverOrSender(stringToParse)

// '21040KWFHP        A  0209  Elisa Oyj                             20                                23.86 -',
const parseMonthlyId = (stringToParse) => {
  stringToParse = removeExtraWhiteSpace(stringToParse)
  const parts = stringToParse.split(' ')
  return parts[parts.length - 3]
}

const parseId = (stringToParse) => {
  stringToParse = removeExtraWhiteSpace(stringToParse)
  const parts = stringToParse.split(' ')
  return parts[0]
}

module.exports = parseTransaction
