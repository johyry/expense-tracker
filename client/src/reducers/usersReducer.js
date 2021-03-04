import userService from '../services/users'
import { handleErrorMessages } from './notificationReducer'

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
    console.log('??', users)
    dispatch({
      type: 'INITIALIZE_USERS',
      data: {
        users,
      },
    })
  } catch (exception) {
    handleErrorMessages('Fetching all users failed', dispatch)
  }
}

export default userReducer
