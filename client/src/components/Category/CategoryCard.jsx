import React, { useState } from 'react'
import { Box, TableHead, Grid2, Typography, Card, CardContent, Button, Collapse, Table, TableBody, TableCell, TableRow, TableContainer, Paper } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { deleteTransaction } from '../../reducers/transactionReducer'
import { Link } from 'react-router-dom'

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

export const CategoryCard = ({ category, transactions }) => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()


  const overviewValues = categoryOverviewValues(transactions)

  const handleDelete = async (id) => {
    try {
      const result = await dispatch(deleteTransaction(id))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid2 item='true' size={{ xs: 12, sm: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h6">{category}</Typography>
          <Typography variant="body2">Total Cost: {overviewValues.totalSum} €</Typography>
          <Typography variant="body2">Average: {overviewValues.averageSum} €</Typography>
          <Typography variant="body2">Expenses: {overviewValues.amountOfTransactions}</Typography>

          <Button size="small" onClick={() => setOpen(!open)} sx={{ marginTop: 1 }}>
            {open ? 'Show Less' : 'Show More'}
          </Button>

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
                  {transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{transaction.receiver}</TableCell>
                      <TableCell align="right">{transaction.sum} €</TableCell>
                      <TableCell align="right">{dayjs(transaction.date).format('DD.MM.YYYY')}</TableCell>
                      <TableCell align="right">{transaction.type}</TableCell>
                      <TableCell align="right">{transaction.comment}</TableCell>
                      <TableCell align="right">
                        <Box display="flex" gap={1}>
                          <Link to={`/transactions/edit/${transaction.mongoId}`}>
                            <EditIcon sx={{ ':hover':{ color: 'orange' } }}/>
                          </Link>
                          <DeleteIcon sx={{ ':hover':{ color: 'red' } }} onClick={() => handleDelete(transaction.mongoId)}/>
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
