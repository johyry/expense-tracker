const test1 =
  '21049DV9P2        K  0218  MobilePay Veikko Vastaanottaja    39                                44.00 +'
const test2 =
  '210429KFBT        K  0211  Hyry Matti Eemil Johannes             26                              900.00 -'
const test3 =
  '21040G864D        A  0209  Helsingin seudun opiskelija-asunto    18                               672.00 -'

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

const result1 = parseBankTransferReceiver(test1)
console.log(result1)

const result2 = parseBankTransferReceiver(test2)
console.log(result2)

const result3 = parseBankTransferReceiver(test3)
console.log(result3)
