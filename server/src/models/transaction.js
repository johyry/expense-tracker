const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const options = { discriminatorKey: 'kind' }
const transactionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    sum: {
      type: Number,
    },
    date: {
      type: Date,
    },
    monthlyTransactionId: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  options,
)

transactionSchema.plugin(uniqueValidator)

const Transaction = mongoose.model('Transaction', transactionSchema)

const receivedBankTransferSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
    },
  },
  options,
)

const ReceivedBankTransferTransaction = Transaction.discriminator(
  'ReceivedBankTransfer',
  receivedBankTransferSchema,
)

const sentBankTransferSchema = new mongoose.Schema(
  {
    receiver: {
      type: String,
    },
  },
  options,
)

const SentBankTransferTransaction = Transaction.discriminator(
  'SentBankTransfer',
  sentBankTransferSchema,
)

const loanWithdrawalSchema = new mongoose.Schema(
  {
    lender: {
      type: String,
    },
  },
  options,
)

const LoanWithdrawalTransaction = Transaction.discriminator(
  'LoanWithdrawal',
  loanWithdrawalSchema,
)

const cardPaymentSchema = new mongoose.Schema(
  {
    shop: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  options,
)

const CardPaymentTransaction = Transaction.discriminator(
  'CardPayment',
  cardPaymentSchema,
)

const atmWithdrawalSchema = new mongoose.Schema(
  {
    location: {
      type: String,
    },
  },
  options,
)

const AtmWithdrawalTransaction = Transaction.discriminator(
  'AtmWithdrawal',
  atmWithdrawalSchema,
)

const bankServiceChargeSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
  },
  options,
)

const BankServiceChargeTransaction = Transaction.discriminator(
  'BankServiceCharge',
  bankServiceChargeSchema,
)

const webPaymentSchema = new mongoose.Schema(
  {
    receiver: {
      type: String,
    },
  },
  options,
)

const WebPaymentTransaction = Transaction.discriminator(
  'WebPayment',
  webPaymentSchema,
)

module.exports = {
  ReceivedBankTransferTransaction,
  SentBankTransferTransaction,
  LoanWithdrawalTransaction,
  CardPaymentTransaction,
  AtmWithdrawalTransaction,
  BankServiceChargeTransaction,
  WebPaymentTransaction,
}
