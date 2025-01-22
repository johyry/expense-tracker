import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Home = () => {
  const navigate = useNavigate()
  const loggedInUser  = useSelector((state) => state.login)

  useEffect(() => {
    if (loggedInUser.username) {
      navigate('/transactions')
    } else {
      navigate('/login')
    }
  }, [navigate, loggedInUser])

  return (
    <div>
      <p>This is a home page</p>
    </div>
  )
}

export default Home
