import userService from '../services/users'
import { handleNotifications } from './notificationReducer'

const userReducer = (state = [], action) => {
  switch (action.type) {
    case 'INITIALIZE_USERS':
      return action.data.users
    default:
      return state
  }
}

export const initializeUsers = () => async (dispatch) => {
  try {
    const users = await userService.getAll()
    dispatch({
      type: 'INITIALIZE_USERS',
      data: {
        users,
      },
    })
  } catch (exception) {
    handleNotifications('Fetching all users failed', dispatch, 'error')
  }
}

export default userReducer
