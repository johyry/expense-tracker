import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { initializeTransactions } from '../../reducers/transactionReducer'
import CategoryPage from './CategoryOverview'

const TransactionsMain = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeTransactions())
  }, [])

  const transactions = useSelector((state) => state.transactions.transactions)
  console.log('transactions:', transactions)
  if (!transactions) return null

  const yearMonth = divideTransactionsByYearAndMonth(transactions)
  console.log('map:', yearMonth)
  return (
    <div>
      <p>Here there is gonna be the transactions page</p>
      <p>2019, 2020, 2021</p>
      <p>1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12</p>

      <CategoryPage transactions={transactions} />
    </div>
  )
}

// Sorts transaction into a map based on month and year
// Map(year, Map(month, array(transactions)))
const divideTransactionsByYearAndMonth = (transactions) => {
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
  return yearMonth
}

export default TransactionsMain
