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
import { Link as RouterLink } from 'react-router-dom'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate  } from 'react-router-dom'
import { handleLogIn } from '../../reducers/loginReducer'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleError = () => {
    setError('Login failed. Please check your credentials.')
    setTimeout(() => {
      setError('')
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const result = await dispatch(handleLogIn({ username, password }))
      if (result.error) {
        console.log('res', result)
        setError('Login failed. Please check your credentials.')
        handleError()
      } else {
        setUsername('')
        setPassword('')
        navigate('/')
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.')
      handleError()
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
        >
        </Avatar>
        <Typography component="h1" variant="h6" sx={{ textAlign: 'center' }}>
            Log In
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, ml: 2, mr: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            placeholder="Enter username"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <TextField
            placeholder="Enter password"
            fullWidth
            required
            type="password"
            sx={{ mb: 2 }}
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, mb: 2 }}>
              Sign In
          </Button>
        </Box>
        <Grid2 container justifyContent="space-between" sx={{ mt: 1, mb: 2, ml: 2 }}>
          <Grid2>
            <Link component={RouterLink} to="/register">
                Create account
            </Link>
          </Grid2>
        </Grid2>
      </Paper>
    </Container>
  )
}

export default LoginPage