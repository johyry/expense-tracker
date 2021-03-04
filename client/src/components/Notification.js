import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector((state) => state.notification.message)
  const type = useSelector((state) => state.notification.type)
  if (message === null) {
    return null
  }

  if (type === 'error') {
    return <div className="errorNotification">{message}</div>
  }

  return <div className="notification">{message}</div>
}

export default Notification
