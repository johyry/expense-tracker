const transactionModels = require('../models/transaction')

const saveTransactions = async (transactions, user) => {
  const promiseArray = []

  transactions.forEach(async (transaction) => {
    let toSave = {}

    if (transaction.type.includes('113')) {
      toSave = new transactionModels.ReceivedBankTransferTransaction({
        ...transaction,
        user: user._id,
      })
    }

    if (transaction.type.includes('127')) {
      toSave = new transactionModels.LoanWithdrawalTransaction({
        ...transaction,
        user: user._id,
      })
    }

    if (transaction.type.includes('205')) {
      toSave = new transactionModels.AtmWithdrawalTransaction({
        ...transaction,
        user: user._id,
      })
    }

    if (transaction.type.includes('209')) {
      toSave = new transactionModels.CardPaymentTransaction({
        ...transaction,
        user: user._id,
      })
    }

    if (transaction.type.includes('213')) {
      toSave = new transactionModels.SentBankTransferTransaction({
        ...transaction,
        user: user._id,
      })
    }

    if (transaction.type.includes('236')) {
      toSave = new transactionModels.BankServiceChargeTransaction({
        ...transaction,
        user: user._id,
      })
    }

    if (transaction.type.includes('256')) {
      toSave = new transactionModels.WebPaymentTransaction({
        ...transaction,
        user: user._id,
      })
    }

    promiseArray.push(toSave.save())
  })
  const result = await Promise.all(promiseArray)
  return result
}

module.exports = saveTransactions
