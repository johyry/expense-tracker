import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate  } from 'react-router-dom'
import { handleLogIn } from '../../reducers/loginReducer'
import Togglable from '../Misc/Togglable'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(handleLogIn({ username, password }))
    setUsername('')
    setPassword('')
    navigate('/')
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
    <h3>Log In</h3>
    <Togglable buttonLabel="Log in">
      <LoginForm />
    </Togglable>
  </div>
)

export default LoginPanel
