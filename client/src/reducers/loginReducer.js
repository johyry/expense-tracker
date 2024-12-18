import loginService from '../services/login'
import transactionService from '../services/transaction'
import fileUploadService from '../services/fileUpload'
import { handleNotifications } from './notificationReducer'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login: (state, action) => (action.payload),
    logout: (state) => ({})
  }
})

export const handleLogIn = (credentials) => {
  return async dispatch => {
    try {
      const loggedInUser = await loginService.login(credentials)
      window.localStorage.setItem('loggedAppUser', JSON.stringify(loggedInUser))
      transactionService.setToken(loggedInUser.token)
      fileUploadService.setToken(loggedInUser.token)
      dispatch(login(loggedInUser))
      return loggedInUser
    } catch (exception) {
      dispatch(handleNotifications('An unexpected error occurred.'))
    }
  }
}

export const checkForAlreadyLoggedInUser = () => {
  return dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const userLog = JSON.parse(loggedUserJSON)
      transactionService.setToken(userLog.token)
      fileUploadService.setToken(userLog.token)
      dispatch(login(userLog))
    }
  }
}

export const handleLogOut = () => {
  return dispatch => {
    window.localStorage.removeItem('loggedAppUser')
    dispatch(logout())
  }
}

export const { login, logout, doothing } = loginSlice.actions

export default loginSlice.reducer
