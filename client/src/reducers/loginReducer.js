import loginService from '../services/login'
import transactionService from '../services/transaction'
import fileUploadService from '../services/fileUpload'
import { handleNotifications } from './notificationReducer'

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
    transactionService.setToken(loggedInUser.token)
    fileUploadService.setToken(loggedInUser.token)
    dispatch({
      type: 'LOGIN',
      data: loggedInUser,
    })
  } catch (exception) {
    handleNotifications('Login failed', dispatch)
  }
}

export const checkForAlreadyLoggedInUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
  if (loggedUserJSON) {
    const userLog = JSON.parse(loggedUserJSON)
    transactionService.setToken(userLog.token)
    fileUploadService.setToken(userLog.token)
    return {
      type: 'SETUSER',
      data: userLog,
    }
  }
  return { type: 'DO_NOTHING' }
}

export const handleLogOut = () => {
  window.localStorage.removeItem('loggedAppUser')
  return {
    type: 'LOGOUT',
  }
}

export default loginReducer
