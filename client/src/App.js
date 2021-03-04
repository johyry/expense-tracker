import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Notification from './components/Notification'
import LoginPanel, { UserLoggedInAndLogOut } from './components/UserComponents'
import { initializeUsers } from './reducers/usersReducer'
import { checkForAlreadyLoggedInUser } from './reducers/loginReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUsers())
    dispatch(checkForAlreadyLoggedInUser())
  }, [dispatch])

  const user = useSelector((state) => state.login)

  const padding = { padding: 5 }

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          home
        </Link>
        {user === '' ? <LoginPanel /> : <UserLoggedInAndLogOut user={user} />}
      </div>

      <Notification />

      {/* <Switch>
        <Route path="/">
        </Route>
      </Switch> */}
    </div>
  )
}

export default App
