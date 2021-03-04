import loginService from '../services/login'
import { handleErrorMessages } from './notificationReducer'

const loginReducer = (state = '', action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.data
    case 'SETUSER':
      return action.data
    case 'LOGOUT':
      return ''
    default:
      return state
  }
}

export const handleLogIn = (credentials) => async (dispatch) => {
  try {
    const loggedInUser = await loginService.login(credentials)
    window.localStorage.setItem('loggedAppUser', JSON.stringify(loggedInUser))
    dispatch({
      type: 'LOGIN',
      data: loggedInUser,
    })
  } catch (exception) {
    handleErrorMessages('Login failed', dispatch)
  }
}

export const checkForAlreadyLoggedInUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
  if (loggedUserJSON) {
    const userLog = JSON.parse(loggedUserJSON)
    return {
      type: 'SETUSER',
      data: userLog,
    }
  }
  return { type: 'DO_NOTHING' }
}

export const handleLogOut = () => ({
  type: 'LOGOUT',
})

export default loginReducer
