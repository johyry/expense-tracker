import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { handleLogOut } from '../../reducers/loginReducer'

const UserLoggedInAndLogOut = ({ user }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const logOut = () => {
    dispatch(handleLogOut())
    history.push('/')
  }

  return (
    <>
      <>{user.username} logged in</>
      <button type="button" onClick={logOut}>
        log out
      </button>
    </>
  )
}

export default UserLoggedInAndLogOut
