import React, { useState } from 'react'

import Transaction from './Transaction'
import Togglable from '../Misc/Togglable'
import Filter from '../Misc/Filter'

const CategoryOverview = ({ transactions }) => {
  sortTransactionsByYearAndMonth(transactions)

  const categoriesAndTransactions = new Map()

  transactions.forEach((transaction) => {
    if (categoriesAndTransactions.has(transaction.category)) {
      categoriesAndTransactions.set(transaction.category, [
        ...categoriesAndTransactions.get(transaction.category),
        transaction,
      ])
    } else {
      categoriesAndTransactions.set(transaction.category, [transaction])
    }
  })

  // const categories = []
  // const listOfTransactionsPerCategory = []
  // categoriesAndTransactions.forEach((value, key) => {
  //   categories.push(key)
  //   listOfTransactionsPerCategory.push(
  //     <th>
  //       {value.map((transaction) => (
  //         <Transaction transaction={transaction} />
  //       ))}
  //     </th>
  //   )
  // })

  const categoryPagesToDisplay = []
  categoriesAndTransactions.forEach((value, key) => {
    categoryPagesToDisplay.push(<CategoryPage title={key} transactions={value} />)
  })

  const style = {
    display: 'flex',
  }

  return (
    <div>
      <h2>Transaction categories:</h2>
      <div style={style}>{categoryPagesToDisplay}</div>
    </div>
  )
}

const CategoryPage = ({ title, transactions }) => {
  const [filter, setFilter] = useState('')

  const filteredTransactions = filterTransactions(transactions, filter)

  let incomingSum = 0
  let outgoingSum = 0
  let incomingAmount = 0
  let outgoingAmount = 0
  filteredTransactions.map((transaction) => {
    if (transaction.sum < 0) {
      outgoingSum += transaction.sum
      outgoingAmount += 1
    } else {
      incomingSum += transaction.sum
      incomingAmount += 1
    }
    return null
  })
  const averageIn = incomingSum / incomingAmount
  const averageOut = outgoingSum / outgoingAmount

  return (
    <table border="1">
      <thead>
        <tr>
          <th>{title}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <p>Incoming:</p>
            <p>Amount of incoming transactions: {incomingAmount}</p>
            <p>Average incoming sum: {averageIn}</p>
            <p>Total incoming: {incomingSum}</p>
            <br />
            <p>Outgoing:</p>
            <p>Amount of outgoing transactions: {outgoingAmount}</p>
            <p>Average outgoing sum: {averageOut}</p>
            <p>Total outgoing: {outgoingSum}</p>
            <br />
            <p>Total sum: {incomingSum + outgoingSum}</p>
          </td>
        </tr>
        <tr>
          <td>
            <Togglable buttonLabel="Show list of transactions">
              <p>List of transactions: </p>
              <Filter
                text="Filter:"
                filter={filter}
                onChange={({ target }) => setFilter(target.value)}
              />
              {filteredTransactions.map((transaction) => (
                <Transaction key={transaction.monthlyTransactionId} transaction={transaction} />
              ))}
            </Togglable>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

const filterTransactions = (transactions, filter) => {
  if (filter === '') return transactions
  const filteredTransactions = []

  transactions.forEach((transaction) => {
    Object.entries(transaction).every((entry) => {
      if (!entry[1]) return true
      if (entry[1].toString().toLowerCase().includes(filter.toLowerCase())) {
        filteredTransactions.push(transaction)
        return false
      }
      return true
    })
  })

  return filteredTransactions
}

const sortTransactionsByYearAndMonth = (transactions) => {
  const yearMonth = new Map()

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date)
    const year = date.getFullYear()
    const month = date.getMonth()
    if (!yearMonth.has(year)) {
      yearMonth.set(year, new Map())
    }

    if (!yearMonth.get(year).has(month)) {
      yearMonth.get(year).set(month, [])
    }

    yearMonth.get(year).set(month, [...yearMonth.get(year).get(month), transaction])
  })

  console.log(yearMonth)

  yearMonth.forEach((value, key) => {
    console.log('Year:', key)
    yearMonth.get(key).forEach((value1, key1) => {
      console.log('Month:', key1)
      yearMonth.get(key).get(key1)
      // .forEach((transaction) => console.log('day:', transaction.date.getDate()))
    })
  })
  return yearMonth
}

export default CategoryOverview
