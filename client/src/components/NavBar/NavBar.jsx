import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import UserLoggedInAndLogOut from '../Login/UserLoggedInAndLogOutButton'

const NavBar = () => {
  const user = useSelector((state) => state.login)

  const padding = { padding: 5 }

  return (
    <div>
      <Link style={padding} to="/">
        Home
      </Link>
      {user === '' ? (
        <Link style={padding} to="/login">
          Log In
        </Link>
      ) : (
        <>
          <Link style={padding} to="/transactions">
            Transactions
          </Link>
          <Link style={padding} to="/pdfupload">
            Upload bankstatement
          </Link>
          <UserLoggedInAndLogOut user={user} />
        </>
      )}
    </div>
  )
}

export default NavBar
