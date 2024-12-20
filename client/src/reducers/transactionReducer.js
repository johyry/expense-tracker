import transactionService from '../services/transaction'
import { handleNotifications } from './notificationReducer'
import { createSlice } from '@reduxjs/toolkit'

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

export const addTransaction = (newTransaction) => async (dispatch) => {
  const transaction = await transactionService.createTransaction(newTransaction)
  dispatch(add(transaction))
  return transaction
}

export const deleteTransaction = (id) => async (dispatch) => {
  const success = await transactionService.deleteTransaction(id)
  dispatch(deleteTr(id))
  return success
}

export const initializeTransactions = () => async (dispatch) => {
  try {
    const transactions = await transactionService.getAll()
    dispatch(initialize(transactions))
  } catch (exception) {
    handleNotifications('Fetching all transactions failed', 'error')
  }
}

export const updateTransaction = (details) => async (dispatch) => {
  const newTransaction = await transactionService.updateTransaction(details)
  dispatch(modify(newTransaction))
  return newTransaction
}

export const { add, initialize, modify, deleteTr } = transactionSlice.actions

export default transactionSlice.reducer
