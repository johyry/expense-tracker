import React, { useState } from 'react'
import { Box, TableHead, Grid2, Typography, Card, CardContent, Button, Collapse, Table, TableBody, TableCell, TableRow, TableContainer, Paper, TextField } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { deleteTransaction } from '../../reducers/transactionReducer'
import { Link } from 'react-router-dom'
import { updateCategory } from '../../reducers/categoryReducer'

const categoryOverviewValues = (transactions) => {
  const totalSum = transactions.reduce((acc, transaction) => acc + transaction.sum, 0)
  const averageSum = (totalSum/transactions.length).toFixed(2)
  const amountOfTransactions = transactions.length


  return {
    totalSum,
    averageSum,
    amountOfTransactions
  }

}

export const CategoryCard = ({ category }) => {
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [categoryName, setCategoryName] = useState(category.name)
  const dispatch = useDispatch()

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleNameChange = (event) => {
    setCategoryName(event.target.value)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    console.log('Save clicked', categoryName)
    const result = await dispatch(updateCategory({ ...category, name: categoryName }))
    console.log('res', result)
    // Here you would dispatch an action to update the category name
    // dispatch(updateCategory({ ...category, name: categoryName }));
    //setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setCategoryName(category.name)
    setIsEditing(false)
  }

  const handleDelete = () => {
    console.log('Delete clicked')
    window.confirm('This is going to delete the category. Not implemented yet.')

  }

  const overviewValues = categoryOverviewValues(category.transactions)

  const handleTransactionDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this transaction?')) {
        const result = await dispatch(deleteTransaction(id))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid2 item='true' size={{ xs: 12, sm: 4 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            {isEditing ? (
              <TextField
                value={categoryName}
                onChange={handleNameChange}
                variant="standard"
                autoFocus
                size="small"
              />
            ) : (
              <Typography variant="h6">{categoryName}</Typography>
            )}
            <Box display="flex" gap={1}>
              {isEditing ? (
                <>
                  <CheckCircleIcon
                    sx={{ cursor: 'pointer', ':hover': { color: 'green' } }}
                    onClick={handleSave}
                  />
                  <CancelIcon
                    sx={{ cursor: 'pointer', ':hover': { color: 'red' } }}
                    onClick={handleCancelEdit}
                  />
                </>
              ) : (
                <>
                  <EditIcon
                    sx={{ cursor: 'pointer', ':hover': { color: 'orange' } }}
                    onClick={handleEditClick}
                  />
                  <DeleteIcon
                    sx={{ cursor: 'pointer', ':hover': { color: 'red' } }}
                    onClick={handleDelete}
                  />
                </>
              )}
            </Box>
          </Box>
          <Typography variant="body2">Total Cost: {overviewValues.totalSum} €</Typography>
          <Typography variant="body2">Average: {overviewValues.averageSum} €</Typography>
          <Typography variant="body2">Expenses: {overviewValues.amountOfTransactions}</Typography>

          <Box display="flex" justifyContent={'flex-end'} gap={1} mr={0.3}>
            {open ?
              <ExpandLessIcon
                sx={{ cursor: 'pointer', mb: 1 }}
                onClick={() => setOpen(!open)}
              /> :
              <ExpandMoreIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => setOpen(!open)}
              />
            }
          </Box>

          <Collapse in={open}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Receiver</TableCell>
                    <TableCell align="right">Sum</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Type</TableCell>
                    <TableCell align="right">Comment</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {category.transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{transaction.receiver}</TableCell>
                      <TableCell align="right">{transaction.sum} €</TableCell>
                      <TableCell align="right">{dayjs(transaction.date).format('DD.MM.YYYY')}</TableCell>
                      <TableCell align="right">{transaction.type}</TableCell>
                      <TableCell align="right">{transaction.comment}</TableCell>
                      <TableCell align="right">
                        <Box display="flex" gap={1}>
                          <Link to={`/transactions/edit/${transaction.mongoId}`}>
                            <EditIcon sx={{ cursor: 'pointer', ':hover': { color: 'orange' } }}/>
                          </Link>
                          <DeleteIcon sx={{ color: 'black', cursor: 'pointer', ':hover': { color: 'red' } }} onClick={() => handleTransactionDelete(transaction.mongoId)}/>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </CardContent>
      </Card>
    </Grid2>
  )
}


export default CategoryCard
