import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Grid2, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import CategoryOverview from '../Category/CategoryOverview'

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
        setCategories(sortedCategories[selectedYear][selectedMonth].categories)
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

  return (
    <div>
      <Grid2 container spacing={2} sx={{ padding: 2 }}>
        <Grid2 item='true' size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Overview</Typography>

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
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
      {categories && <CategoryOverview sortedCategories={categories} />}
    </div>
  )
}

export default TransactionsMain
