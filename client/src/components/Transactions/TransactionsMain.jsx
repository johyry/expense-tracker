import React from 'react'
import { useSelector } from 'react-redux'

// import { initializeTransactions } from '../../reducers/transactionReducer'
import CategoryOverview from '../Category/CategoryOverview'

const TransactionsMain = () => {

  return (
    <div>
      <CategoryOverview />
    </div>
  )
}

export default TransactionsMain
