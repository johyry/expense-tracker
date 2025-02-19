import transactionService from '../services/transaction'
import { handleNotifications } from './notificationReducer'
import { createSlice } from '@reduxjs/toolkit'
import { produce } from 'immer'
import { modify as modifySortedCategory } from './sortedCategoryReducer'
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

export const addTransaction = (newTransactionDetails) => async (dispatch, getState) => {
  const newTransaction = await transactionService.createTransaction(newTransactionDetails)

  // modify categories state
  const categories = getState().categories
  const category = categories.find(c => c.id === newTransaction.category)
  if (category) {
    const updatedCategory = {
      ...category,
      transactions: [...category.transactions, newTransaction]
    }
    dispatch(modifyCategory(updatedCategory))
  }

  dispatch(add(newTransaction))

  return newTransaction
}

export const deleteTransaction = (transaction) => async (dispatch, getState) => {
  const success = await transactionService.deleteTransaction(transaction.mongoId)
  dispatch(deleteTr(transaction.mongoId))

  // Update category's transactions array
  const categories = getState().categories
  const categoryToUpdate = categories.find(category =>
    category.transactions.some(t => t.mongoId === transaction.mongoId)
  )

  if (categoryToUpdate) {
    const updatedCategory = {
      ...categoryToUpdate,
      transactions: categoryToUpdate.transactions.filter(t => t.mongoId !== transaction.mongoId)
    }
    dispatch(modifyCategory(updatedCategory))
  }

  return success
}

export const updateTransaction = (details) => async (dispatch, getState) => {
  const newTransaction = await transactionService.updateTransaction(details)
  dispatch(modify(newTransaction))

  const categories = getState().categories
  const newCategory = categories.find(c => c.id === newTransaction.category)
  const oldCategory = categories.find(c => c.transactions.some(t => t.mongoId === newTransaction.mongoId))

  if (newCategory.id !== oldCategory.id) { // If transaction's category has changed
    if (newCategory) {
      const updatedCategory = { ...newCategory, transactions: [ ...newCategory.transactions, newTransaction ] }
      dispatch(modifyCategory(updatedCategory))
    }

    if (oldCategory) {
      const updatedCategory = {
        ...oldCategory,
        transactions: oldCategory.transactions.filter(t => t.mongoId !== newTransaction.mongoId)
      }
      dispatch(modifyCategory(updatedCategory))
    }
  } else { // If transaction's category has not changed
    const updatedCategory = {
      ...newCategory,
      transactions: newCategory.transactions.map(t => t.mongoId === newTransaction.mongoId ? newTransaction : t)
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