import {
  Avatar,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Link,
  Grid2,
  Alert
} from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { handleLogIn } from '../../reducers/loginReducer'
import { createUser } from '../../services/signup'

const AuthPage = ({ isRegister = false }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [notification, setNotification] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { state } = useLocation()

  const handleError = (message) => {
    setError(message)
    setTimeout(() => {
      setError('')
    }, 5000)
  }

  const handleNotification = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  useEffect(() => {
    if (state && state.message) {
      handleNotification(state.message)
    }
  }, [state])

  const handleAuth = async (event) => {
    event.preventDefault()
    if (isRegister && password !== confirmPassword) {
      handleError('Passwords do not match.')
      return
    }
    try {
      const result = isRegister
        ? await createUser({ username, password })
        : await dispatch(handleLogIn({ username, password }))
      setUsername('')
      setPassword('')
      setConfirmPassword('')
      if (isRegister) {
        navigate('/login', { state: { message: 'User created succesfully.' } })
      } else {
        navigate('/')
      }
    } catch (error) {
      handleError(isRegister ? `Registration failed. ${error.response.data.error}` : `Login failed. ${error.response.data.error}`)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2, width: '100%' }}>
        <Avatar
          sx={{
            mx: 'auto',
            bgcolor: 'secondary.main',
            textAlign: 'center',
            mb: 1,
            mt: 2
          }}
        ></Avatar>
        <Typography component="h1" variant="h6" sx={{ textAlign: 'center' }}>
          {isRegister ? 'Create Account' : 'Log In'}
        </Typography>
        <Box component="form" onSubmit={handleAuth} noValidate sx={{ mt: 1, ml: 2, mr: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {notification && <Alert severity="success" sx={{ mb: 2 }}>{notification}</Alert>}
          <TextField
            label="Username"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <TextField
            label="Password"
            fullWidth
            required
            type="password"
            sx={{ mb: 2 }}
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          {isRegister && (
            <TextField
              label="Confirm password"
              fullWidth
              required
              type="password"
              sx={{ mb: 2 }}
              value={confirmPassword}
              onChange={({ target }) => setConfirmPassword(target.value)}
            />
          )}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, mb: 2 }}>
            {isRegister ? 'Sign Up' : 'Sign In'}
          </Button>
        </Box>
        <Grid2 container justifyContent="space-between" sx={{ mt: 1, mb: 2, ml: 2 }}>
          <Grid2>
            <Link component={RouterLink} to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Already have an account? Log in' : 'Create account'}
            </Link>
          </Grid2>
        </Grid2>
      </Paper>
    </Container>
  )
}

export default AuthPage
