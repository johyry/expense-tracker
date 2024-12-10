import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { handleLogOut } from '../../reducers/loginReducer'

const UserLoggedInAndLogOut = ({ user }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logOut = () => {
    dispatch(handleLogOut())
    navigate('/')
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
