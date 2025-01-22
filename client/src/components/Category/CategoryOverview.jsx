import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { CategoryCard } from './CategoryCard'
import { Stack, Grid2, Card, CardContent, Box, Typography, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Tooltip from '@mui/material/Tooltip'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useDispatch } from 'react-redux'
import { addCategory } from '../../reducers/categoryReducer'
import Pie from '../Charts/Pie'
import Barchart from '../Charts/Bar'

const CategoryOverview = () => {
  const [openNewCategory, setOpenNewCategory] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const dispatch = useDispatch()

  const categories  = useSelector((state) => state.categories)

  const overviewValues = calculateCategoryOverviewValues(categories)
  const specifiedCategoryValues = calculateSpecifiedCategoryValues(categories, overviewValues)

  const handleAddCategory = () => {
    dispatch(addCategory({ name: categoryName }))
    setCategoryName('')
    setOpenNewCategory(false)
  }

  return (
    <div>
      <Grid2 container spacing={2} sx={{ padding: 2 }}>
        <Grid2 item='true' size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Category overview</Typography>
                <Box display="flex" gap={1}>
                  {openNewCategory ? (
                    <>
                      <TextField
                        value={categoryName}
                        onChange={(event) => setCategoryName(event.target.value)}
                        variant="standard"
                        autoFocus
                        size="small"
                      />
                      <CheckCircleIcon
                        sx={{ cursor: 'pointer', ':hover': { color: 'green' } }}
                        onClick={handleAddCategory}
                      />
                      <CancelIcon
                        sx={{ cursor: 'pointer', ':hover': { color: 'red' } }}
                        onClick={() => setOpenNewCategory(false)}
                      />
                    </>
                  ) : (
                    <Tooltip title="Add New Category" arrow>
                      <AddIcon
                        sx={{ cursor: 'pointer' }}
                        onClick={() => setOpenNewCategory(true)}
                      />
                    </Tooltip>
                  )}
                </Box>
              </Box>
              <Typography variant="body2">Total Cost: {overviewValues.totalAmount} €</Typography>
              <Typography variant="body2">Average: {overviewValues.average} €</Typography>
              <Typography variant="body2">Expenses: {overviewValues.amountOfExpenses}</Typography>
              <Stack   direction={{ xs: 'column', sm: 'row' }} width="100%" textAlign="center" justifyContent='space-evenly' spacing={2}>
                <Box
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Typography variant="body2">Total cost (€)</Typography>
                  <Barchart categories={specifiedCategoryValues} />
                </Box>
                <Box
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Typography variant="body2">% of total</Typography>
                  <Pie categories={categories} categoryOverviewValues={overviewValues} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
      <Grid2 container spacing={2} sx={{ padding: 2 }}>
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </Grid2>
    </div>
  )
}

const calculateCategoryOverviewValues = (categories) => {
  const totalAmount = categories.reduce((acc, category) => {
    if (category.transactions.length === 0) return acc
    const catTotal = category.transactions.reduce((acc, transaction) => acc + transaction.sum, 0)
    return acc + catTotal
  }, 0)
  const amountOfExpenses = categories.reduce((acc, category) => {
    if (category.transactions.length === 0) return acc
    return acc + category.transactions.length
  }, 0)
  const average = (totalAmount / amountOfExpenses).toFixed(2)
  return { totalAmount, amountOfExpenses, average }
}

const calculateSpecifiedCategoryValues = (categories, categoryOverviewValues) => {
  return categories.map((category) => {
    const newObj = { ...category }
    newObj.totalSum = category.transactions.reduce((acc, transaction) => acc + transaction.sum, 0)
    newObj.amountOfTransactions = category.transactions.length
    if (newObj.totalSum !== 0) {
      newObj.percentageOfTotal = (newObj.totalSum / categoryOverviewValues.totalAmount) * 100
      newObj.averageSum = newObj.totalSum / newObj.amountOfTransactions
    } else {
      newObj.percentageOfTotal = 0
      newObj.averageSum = 0
    }
    return newObj
  })
}

export default CategoryOverview
