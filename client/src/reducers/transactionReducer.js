import transactionService from '../services/transaction'
import { handleNotifications } from './notificationReducer'

const transactionReducer = (state = '', action) => {
  switch (action.type) {
  case 'INITIALIZE_TRANSACTIONS':
    return action.data.transactions
  case 'CHANGECATEGORY': {
    return state.map((transaction) =>
      transaction.mongoId === action.data.mongoId ? action.data : transaction
    )
  }
  default:
    return state
  }
}

export const initializeTransactions = () => async (dispatch) => {
  try {
    const transactions = await transactionService.getAll()
    dispatch({
      type: 'INITIALIZE_TRANSACTIONS',
      data: {
        transactions,
      },
    })
  } catch (exception) {
    handleNotifications('Fetching all transactions failed', dispatch, 'error')
  }
}

export const changeCategory = (details) => async (dispatch) => {
  try {
    const newTransaction = await transactionService.changeCategory(details)
    dispatch({
      type: 'CHANGECATEGORY',
      data: newTransaction,
    })
  } catch (exception) {
    handleNotifications('Changing category failed. :(')
  }
}

export default transactionReducer
