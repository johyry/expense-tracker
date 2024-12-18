import { createSlice } from '@reduxjs/toolkit'

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    display: (action) => {
      return action.payload
    },
    remove: () => {
      return ''
    }
  }
})

let timeoutId

export const handleNotifications = (message) => async (dispatch) => {
  dispatch(display(message))

  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    dispatch(remove())
  }, 5000)
}

export const { display, remove } = notificationSlice.actions

export default notificationSlice.reducer
