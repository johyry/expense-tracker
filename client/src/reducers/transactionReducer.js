import transactionService from '../services/transaction'
import { handleNotifications } from './notificationReducer'
import { createSlice } from '@reduxjs/toolkit'

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState: [],
  reducers: {
    initialize: (state, action) => {
      return (action.payload)
    },
    modify: (state, action) => {
      return state.map((transaction) => transaction.mongoId === action.payload.mongoId ? action.payload : transaction)
    }
  }
})

export const initializeTransactions = () => async (dispatch) => {
  try {
    const transactions = await transactionService.getAll()
    console.log(transactions)
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

export const { initialize, modify } = transactionSlice.actions

export default transactionSlice.reducer
