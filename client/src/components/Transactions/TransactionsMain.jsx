import React from 'react'
import { useSelector } from 'react-redux'

// import { initializeTransactions } from '../../reducers/transactionReducer'
import CategoryPage from '../Category/CategoryOverview'

const TransactionsMain = () => {
  // const dispatch = useDispatch()
  // useEffect(() => {
  //   dispatch(initializeTransactions())
  // }, [])

  const transactions = useSelector((state) => state.transactions)
  if (!transactions) return null

  const yearMonth = divideTransactionsByYearAndMonth(transactions)
  return (
    <div>
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
