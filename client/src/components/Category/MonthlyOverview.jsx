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

const MonthlyOverview = ({ monthlyData }) => {
  const [openNewCategory, setOpenNewCategory] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const dispatch = useDispatch()

  const categories = monthlyData.categories

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
                <Typography variant="h6">Monthly overview</Typography>
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
              <Typography variant="body2">Total Cost: {monthlyData.totalMonthlyCosts} €</Typography>
              <Typography variant="body2">Average: {monthlyData.averageMonthlyCost} €</Typography>
              <Typography variant="body2">Expenses: {monthlyData.amountOfMonthlyExpenses}</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} width="100%" textAlign="center" justifyContent='space-evenly' spacing={2}>
                <Box
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Typography variant="body2">Total cost (€)</Typography>
                  <Barchart monthlyData={monthlyData} />
                </Box>
                <Box
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Typography variant="body2">% of total</Typography>
                  <Pie monthlyData={monthlyData} />
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

export default MonthlyOverview
