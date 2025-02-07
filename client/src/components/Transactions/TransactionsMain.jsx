import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Stack, Box, Grid2, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import MonthlyOverview from '../Category/MonthlyOverview'
import Linechart from '../Charts/Line'

const TransactionsMain = () => {
  const [previousYear, setPreviousYear] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [availableMonths, setAvailableMonths] = useState([])
  const [categories, setCategories] = useState(null)

  const sortedCategories = useSelector((state) => state.sortedCategories)

  useEffect(() => {
    const yearExists = sortedCategories && Object.keys(sortedCategories).includes(String(selectedYear))
    if (!yearExists) {
      setSelectedYear('')
      setSelectedMonth('')
    }

    if (selectedYear && yearExists) {
      setAvailableMonths(Object.keys(sortedCategories[selectedYear]))
    }
  }, [selectedYear, sortedCategories])

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      if (sortedCategories[selectedYear] && sortedCategories[selectedYear][selectedMonth]) {
        setCategories(sortedCategories[selectedYear][selectedMonth])
      }
    } else {
      setCategories(null)
    }
  }, [selectedYear, selectedMonth, sortedCategories])

  const handleYearChange = (event) => {
    if (selectedYear) setPreviousYear(selectedYear)
    setSelectedMonth('')
    setSelectedYear(event.target.value)
  }

  const averageMonthlyCosts = calculateAverageMontlyCosts(sortedCategories)

  return (
    <div>
      <Grid2 container spacing={2} sx={{ padding: 2 }}>
        <Grid2 item='true' size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography mb={2} variant="h6">Overview</Typography>
              <Typography variant="body2">Average monthly costs: {averageMonthlyCosts} €</Typography>
              <Typography variant="body2">Category data: </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} width="100%" textAlign="center" justifyContent='space-evenly' spacing={2}>
                <Box
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Typography variant="body2">Total monthly expenses (€)</Typography>
                  <Linechart sortedCategories={sortedCategories} />
                </Box>
              </Stack>

              <Box sx={{ padding: 2 }}>
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <InputLabel id="type-label">Year</InputLabel>
                  <Select
                    labelId="type-label"
                    value={selectedYear}
                    label="Year"
                    onChange={handleYearChange}
                  >
                    {Object.keys(sortedCategories).map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <InputLabel>Month</InputLabel>
                  <Select value={selectedMonth} onChange={({ target }) => setSelectedMonth(target.value)} label="Month">
                    {availableMonths.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
      {categories && <MonthlyOverview monthlyData={categories} />}
    </div>
  )
}

const calculateAverageMontlyCosts = (sortedCategories) => {
  let total = 0
  let amount = 0
  Object.entries(sortedCategories).forEach(([year, yearData]) => {
    Object.entries(yearData).forEach(([month, monthData]) => {
      total += monthData.totalMonthlyCosts
      amount ++
    })
  })

  return (total/amount).toFixed(2)
}

export default TransactionsMain
