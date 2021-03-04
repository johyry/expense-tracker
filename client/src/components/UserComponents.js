import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { handleLogIn, handleLogOut } from '../reducers/loginReducer'
import Togglable from './Togglable'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(handleLogIn({ username, password }))
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        käyttäjätunnus
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        salasana
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">kirjaudu</button>
    </form>
  )
}

const LoginPanel = () => (
  <div>
    <h2>Log In</h2>
    <Togglable buttonLabel="Log in">
      <LoginForm />
    </Togglable>
  </div>
)

export const UserLoggedInAndLogOut = ({ user }) => {
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

export default LoginPanel
