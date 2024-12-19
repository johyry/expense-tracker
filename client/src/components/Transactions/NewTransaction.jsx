import {
  Avatar,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import React, { useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { addTransaction } from '../../reducers/transactionReducer'
import transaction from '../../services/transaction'

const NewTransaction = () => {
  const [receiver, setReceiver] = useState('')
  const [sum, setSum] = useState('')
  const [date, setDate] = useState(dayjs())
  const [type, setType] = useState('')
  const [category, setCategory] = useState('Other')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [notification, setNotification] = useState('')

  const dispatch = useDispatch()

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


  const validateInput = () => {
    if (receiver === '') return 'Receiver is required.'
    if (sum === '' || sum <= 0) return 'Sum is required and needs to be positive.'
    if (type === '') return 'Type is required.'
    if (category === '') return 'Category is required.'
    return
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const transaction = {
      receiver,
      sum,
      date,
      type,
      category,
      comment
    }

    const validateError = validateInput()

    if (validateError) {
      handleError(validateError)
    } else {
      try {
        const result = await dispatch(addTransaction(transaction))
        if (result) {
          setReceiver('')
          setSum('')
          setDate(dayjs())
          setType('')
          setCategory('')
          setComment('')
          handleNotification('Transaction created succesfully.')
        }
      } catch (error) {
        handleError(`Creating transaction failed. ${error.response.data.error}`)
      }
    }
  }

  const typeOptions = [
    'Cash',
    'Credit Card',
    'Bank Transfer',
    'BTC',
    'Other'
  ]

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2, width: '100%' }}>
        <Typography component="h1" variant="h6" sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
              New Transaction
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, ml: 2, mr: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {notification && <Alert severity="success" sx={{ mb: 2 }}>{notification}</Alert>}
          <TextField
            label="Receiver"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            value={receiver}
            onChange={({ target }) => setReceiver(target.value)}
          />
          <TextField
            label="Sum"
            type="number"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={sum}
            onChange={({ target }) => setSum(target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              fullWidth
              required
              sx={{ mb: 2, width: '100%' }}
              value={date}
              onChange={(newDate) => setDate(newDate)}
            />
          </LocalizationProvider>
          <FormControl fullWidth required sx={{ mb: 2 }}>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              value={type}
              label="Type"
              onChange={({ target }) => setType(target.value)}
            >
              {typeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Category"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={category}
            onChange={({ target }) => setCategory(target.value)}
          />
          <TextField
            label="Comment"
            fullWidth
            sx={{ mb: 2 }}
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, mb: 2 }}>
                Add
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}


export default NewTransaction