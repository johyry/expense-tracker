import React from 'react'
import styled from 'styled-components'

const Div = styled.div`
  border: 1px solid #ccc !important;
  border-top-color: rgb(204, 204, 204) !important;
  border-top-style: solid !important;
  border-top-width: 1px !important;
  border-right-color: rgb(204, 204, 204) !important;
  border-right-style: solid !important;
  border-right-width: 1px !important;
  border-bottom-color: rgb(204, 204, 204) !important;
  border-bottom-style: solid !important;
  border-bottom-width: 1px !important;
  border-left-color: rgb(204, 204, 204) !important;
  border-left-style: solid !important;
  border-left-width: 1px !important;
  border-image-source: initial !important;
  border-image-slice: initial !important;
  border-image-width: initial !important;
  border-image-outset: initial !important;
  border-image-repeat: initial !important;
  border-radius: 12px;
`

const Transaction = ({ transaction }) => {
  let typeToReturn = {}

  if (transaction.kind === 'ReceivedBankTransfer') {
    typeToReturn = <ReceivedBankTransfer transaction={transaction} />
  }

  if (transaction.kind === 'SentBankTransfer') {
    typeToReturn = <SentBankTransfer transaction={transaction} />
  }

  if (transaction.kind === 'LoanWithdrawal') {
    typeToReturn = <LoanWithdrawal transaction={transaction} />
  }

  if (transaction.kind === 'AtmWithdrawal') {
    typeToReturn = <AtmWithdrawal transaction={transaction} />
  }

  if (transaction.kind === 'CardPayment') {
    typeToReturn = <CardPayment transaction={transaction} />
  }

  if (transaction.kind === 'BankServiceCharge') {
    typeToReturn = <BankServiceCharge transaction={transaction} />
  }

  if (transaction.kind === 'WebPayment') {
    typeToReturn = <WebPayment transaction={transaction} />
  }

  const date = new Date(transaction.date)

  return (
    <Div>
      {typeToReturn}
      <p>Sum: {transaction.sum}</p>
      <p>Type: {transaction.kind}</p>
      <p>
        Date: {date.getDate() + 1}.{date.getMonth() + 1}.{date.getFullYear()}
      </p>
      <p>Category: {transaction.category}</p>
    </Div>
  )
}

const ReceivedBankTransfer = ({ transaction }) => (
  <>
    <p>Sender: {transaction.sender}</p>
  </>
)

const SentBankTransfer = ({ transaction }) => (
  <>
    <p>Receiver: {transaction.receiver}</p>
  </>
)

const LoanWithdrawal = ({ transaction }) => (
  <>
    <p>Lender: {transaction.lender}</p>
  </>
)

const AtmWithdrawal = ({ transaction }) => (
  <>
    <p>Location: {transaction.location}</p>
  </>
)

const CardPayment = ({ transaction }) => (
  <>
    <p>Shop: {transaction.shop}</p>
    <p>Location: {transaction.location}</p>
  </>
)

const BankServiceCharge = ({ transaction }) => (
  <>
    <p>Description: {transaction.description}</p>
  </>
)

const WebPayment = ({ transaction }) => (
  <>
    <p>Receiver: {transaction.receiver}</p>
  </>
)

export default Transaction
