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

export const initializeTransactions = () => async (dispatch) => {
  try {
    const transactions = await transactionService.getAll()
    dispatch(initialize(transactions))
  } catch (exception) {
    handleNotifications('Fetching all transactions failed', 'error')
  }
}

export const changeCategory = (details) => async (dispatch) => {
  try {
    const newTransaction = await transactionService.changeCategory(details)
    dispatch(modify(newTransaction))
  } catch (exception) {
    handleNotifications('Changing category failed. :(')
  }
}

export const { add, initialize, modify } = transactionSlice.actions

export default transactionSlice.reducer
