const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'DISPLAYNOTIFICATION':
      return action.data
    case 'REMOVENOTIFICATION':
      return action.data
    default:
      return state
  }
}

let timeoutId

export const handleNotifications = (message) => async (dispatch) => {
  dispatch({
    type: 'DISPLAYNOTIFICATION',
    message,
  })

  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    dispatch({
      type: 'REMOVENOTIFICATION',
    })
  }, 5000)
}

export default notificationReducer
