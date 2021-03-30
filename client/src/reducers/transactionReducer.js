import transactionService from '../services/transaction'
import { handleNotifications } from './notificationReducer'

const transactionReducer = (state = '', action) => {
  switch (action.type) {
    case 'INITIALIZE_TRANSACTIONS':
      return action.data
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

export default transactionReducer
