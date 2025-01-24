import transactionService from '../services/transaction'
import { handleNotifications } from './notificationReducer'
import { createSlice } from '@reduxjs/toolkit'
import { produce } from 'immer'
import { modify as modifySortedCategory } from './sortedCategoryReducer'

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

  const date = new Date(newTransaction.date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  const updatedSortedCategories = produce(getState().sortedCategories, draft => {
    if (!draft[year]) {
      draft[year] = {}
    }
    if (!draft[year][month]) {
      draft[year][month] = { categories: [] }
    }

    const categoryIndex = draft[year][month].categories.findIndex(c => c.id === newTransaction.category)
    if (categoryIndex !== -1) {
      draft[year][month].categories[categoryIndex].transactions.push(newTransaction)
    } else {
      const categories = getState().categories

      categories.forEach(category => {
        const newCategory = {
          id: category.id,
          name: category.name,
          transactions: []
        }
        if (newCategory.id === newTransaction.category) {
          newCategory.transactions.push(newTransaction)
        }
        draft[year][month].categories.push(newCategory)
      })
    }
  })

  dispatch(modifySortedCategory(updatedSortedCategories))
  dispatch(add(newTransaction))

  return newTransaction
}

export const deleteTransaction = (transaction) => async (dispatch, getState) => {
  const success = await transactionService.deleteTransaction(transaction.mongoId)
  dispatch(deleteTr(transaction.mongoId))

  const date = new Date(transaction.date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  const updatedSortedCategories = produce(getState().sortedCategories, draft => {
    const categoryIndex = draft[year][month].categories.findIndex(
      category => category.id === transaction.category
    )

    if (categoryIndex !== -1) {
      draft[year][month].categories[categoryIndex].transactions =
        draft[year][month].categories[categoryIndex].transactions.filter(
          t => t.mongoId !== transaction.mongoId
        )
    }

    // Check if all categories' transactions are empty
    const allCategoriesEmpty = draft[year][month].categories.every(
      category => category.transactions.length === 0
    )

    if (allCategoriesEmpty) {
      delete draft[year][month]

      // Check if the year is now empty
      if (Object.keys(draft[year]).length === 0) {
        delete draft[year]
      }
    }
  })

  dispatch(modifySortedCategory(updatedSortedCategories))

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
      dispatch(modifySortedCategory(updatedCategory))
    }

    if (oldCategory) {
      const updatedCategory = {
        ...oldCategory,
        transactions: oldCategory.transactions.filter(t => t.mongoId !== newTransaction.mongoId)
      }
      dispatch(modifySortedCategory(updatedCategory))
    }
  } else { // If transaction's category has not changed
    const updatedCategory = {
      ...newCategory,
      transactions: newCategory.transactions.map(t => t.mongoId === newTransaction.mongoId ? newTransaction : t)
    }
    dispatch(modifySortedCategory(updatedCategory))
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