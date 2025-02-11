import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Stack, Box, Grid2, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import MonthlyOverview from '../Category/MonthlyOverview'
import Linechart from '../Charts/Line'
import Barchart from '../Charts/Bar'
import { cardStyle } from '../Styles/Card'

const TransactionsMain = () => {
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
    setSelectedMonth('')
    setSelectedYear(event.target.value)
  }

  const averageCategoryCosts = calculateAverageCategoryCosts(sortedCategories)

  return (
    <div>
      <Grid2 container spacing={2} sx={{ padding: 2 }}>
        <Grid2 item='true' size={{ xs: 12 }}>
          <Card sx={cardStyle}>
            <CardContent>
              <Grid2 sx={{ padding: 2, paddingLeft: 2 }}>
                <Typography mb={2} sx={{ fontWeight: 'bold' }} variant="h6">Overview</Typography>
                <Statistics sortedCategories={sortedCategories} />
              </Grid2>
              <Stack direction={{ xs: 'column', sm: 'row' }} width="100%" textAlign="center" justifyContent='space-evenly' spacing={2}>
                <Box
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Typography variant="body2">Total expenses each month (€)</Typography>
                  <Linechart sortedCategories={sortedCategories} />
                </Box>
                <Box
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Typography variant="body2">Category total expenses on average (€)</Typography>
                  <Barchart averageCategoryCosts={averageCategoryCosts} />
                </Box>
              </Stack>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body2" sx={{ paddingLeft: 1.5, paddingBottom: 1 }}>View monthly data</Typography>
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
              {categories && <MonthlyOverview monthlyData={categories} />}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </div>
  )
}

const calculateAverageCategoryCosts = (sortedCategories) => {
  let categoriesWithAverageCosts = []
  let rounds = 0
  Object.entries(sortedCategories).forEach(([year, yearData]) => {
    Object.entries(yearData).forEach(([month, monthData]) => {
      monthData.categories.forEach((category) => {
        const cat = categoriesWithAverageCosts.find((c) => c.name === category.name)
        if (cat) {
          cat.total += category.totalCosts
        } else {
          categoriesWithAverageCosts.push({ name: category.name, total: category.totalCosts })
        }
      })
      rounds++
    })
  })

  categoriesWithAverageCosts.forEach((cat) => cat.average = parseFloat((cat.total/rounds).toFixed(2)))

  return categoriesWithAverageCosts
}

const calculateStatistics = (sortedCategories) => {
  let statistics = {}

  let totalCost = 0
  let amountOfMonths = 0
  let amountOfTransactions = 0
  let monthWithMostCosts = { amount: 0 }
  let monthWithLeastCosts = { amount: 1000000000 }

  Object.entries(sortedCategories).forEach(([year, yearData]) => {
    Object.entries(yearData).forEach(([month, monthData]) => {
      if (monthWithLeastCosts.amount > monthData.totalMonthlyCosts) {
        monthWithLeastCosts.amount = monthData.totalMonthlyCosts
        monthWithLeastCosts.date = `${month}/${year}`
      }

      if (monthWithMostCosts.amount < monthData.totalMonthlyCosts) {
        monthWithMostCosts.amount = monthData.totalMonthlyCosts
        monthWithMostCosts.date = `${month}/${year}`
      }

      totalCost += monthData.totalMonthlyCosts
      amountOfMonths ++
      monthData.categories.forEach((category) => {
        amountOfTransactions += category.transactions.length
      })
    })
  })

  statistics.averageMonthlyCost = (totalCost/amountOfMonths).toFixed(2)
  statistics.amountOfTransactions = amountOfTransactions
  statistics.monthWithLeastCosts = monthWithLeastCosts
  statistics.monthWithMostCosts = monthWithMostCosts

  return statistics
}

const Statistics = ({ sortedCategories }) => {
  const statistics = calculateStatistics(sortedCategories)

  return (
    <>
      <Typography variant="body2">Average monthly cost: {statistics.averageMonthlyCost} €</Typography>
      <Typography variant="body2">Total amount of transactions: {statistics.amountOfTransactions} </Typography>
      <Typography variant="body2">Month with least amount of costs: {statistics.monthWithLeastCosts.date}, {statistics.monthWithLeastCosts.amount} €</Typography>
      <Typography variant="body2">Month with most amount of costs: {statistics.monthWithMostCosts.date}, {statistics.monthWithMostCosts.amount} €</Typography>
    </>
  )
}



export default TransactionsMain
