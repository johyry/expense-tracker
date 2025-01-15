import transactionService from '../services/transaction'
import { handleNotifications } from './notificationReducer'
import { createSlice } from '@reduxjs/toolkit'

import { modify as modifyCategory } from './categoryReducer'

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState: [],
  reducers: {
    add: (state, action) => {
      return (state.concat(action.payload))
    },
    deleteTr: (state, action) => {
      return state.filter((transaction) => transaction.mongoId !== action.payload)
    },
    initialize: (state, action) => {
      return (action.payload)
    },
    modify: (state, action) => {
      return state.map((transaction) => transaction.mongoId === action.payload.mongoId ? action.payload : transaction)
    }
  }
})

export const addTransaction = (newTransaction) => async (dispatch, getState) => {
  const transaction = await transactionService.createTransaction(newTransaction)
  dispatch(add(transaction))

  // Update category's transactions array
  const categories = getState().categories
  const category = categories.find(c => c.id === transaction.category)
  if (category) {
    console.log('category found', category)
    const updatedCategory = {
      ...category,
      transactions: [...category.transactions, {
        sum: transaction.sum,
        date: transaction.date,
        type: transaction.type,
        receiver: transaction.receiver,
        user: transaction.user,
        category: transaction.category,
        mongoId: transaction.mongoId
      }]
    }
    console.log('updatedCat', updatedCategory)
    dispatch(modifyCategory(updatedCategory))
  }

  return transaction
}

export const deleteTransaction = (id) => async (dispatch, getState) => {
  const success = await transactionService.deleteTransaction(id)
  dispatch(deleteTr(id))

  // Update category's transactions array
  const categories = getState().categories
  const categoryToUpdate = categories.find(category =>
    category.transactions.some(t => t.mongoId === id)
  )

  if (categoryToUpdate) {
    const updatedCategory = {
      ...categoryToUpdate,
      transactions: categoryToUpdate.transactions.filter(t => t.mongoId !== id)
    }
    dispatch(modifyCategory(updatedCategory))
  }

  return success
}

export const updateTransaction = (details) => async (dispatch, getState) => {
  const newTransaction = await transactionService.updateTransaction(details)
  dispatch(modify(newTransaction))

  // Update category's transactions array
  const categories = getState().categories
  const categoryToUpdate = categories.find(category =>
    category.transactions.some(t => t.mongoId === newTransaction.mongoId)
  )

  if (categoryToUpdate) {
    const updatedCategory = {
      ...categoryToUpdate,
      transactions: categoryToUpdate.transactions.map(t =>
        t.mongoId === newTransaction.mongoId
          ? {
            sum: newTransaction.sum,
            date: newTransaction.date,
            type: newTransaction.type,
            receiver: newTransaction.receiver,
            user: newTransaction.user,
            category: newTransaction.category,
            mongoId: newTransaction.mongoId
          }
          : t
      )
    }
    dispatch(modifyCategory(updatedCategory))
  }

  return newTransaction
}

export const initializeTransactions = () => async (dispatch) => {
  try {
    const transactions = await transactionService.getAll()
    dispatch(initialize(transactions))
  } catch (exception) {
    handleNotifications('Fetching all transactions failed', 'error')
  }
}


export const { add, initialize, modify, deleteTr } = transactionSlice.actions

export default transactionSlice.reducer