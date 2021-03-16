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

export const displayNotification = (message, type, dispatch) => {
  dispatch({
    type: 'DISPLAYNOTIFICATION',
    data: { message, type },
  })
}

export const removeNotification = (type, dispatch) => {
  dispatch({
    type: 'REMOVENOTIFICATION',
    data: { message: '', type },
  })
}

export const handleNotifications = (message, dispatch, type) => {
  displayNotification(message, type, dispatch)
  setTimeout(() => {
    removeNotification(type, dispatch)
  }, 5000)
}

export default notificationReducer
