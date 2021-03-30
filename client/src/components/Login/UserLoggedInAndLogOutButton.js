import React from 'react'
import { useDispatch } from 'react-redux'
import { handleLogOut } from '../../reducers/loginReducer'

const UserLoggedInAndLogOut = ({ user }) => {
  const dispatch = useDispatch()

  const logOut = () => {
    dispatch(handleLogOut())
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
