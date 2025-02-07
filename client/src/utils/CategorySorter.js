export const sortCategoriesByDateAndCalculateStatistics = (categories) => {
  // Get all unique transactions dates as YYYY/MM
  const dates = categories.flatMap(category =>
    category.transactions.map(t => {
      const date = new Date(t.date)
      return `${date.getFullYear()}/${String(date.getMonth() + 1)}`
    })
  ).filter((date, index, self) => self.indexOf(date) === index)

  // Create sorted object
  const sortedByYearAndMonth = dates.reduce((acc, dateStr) => {
    const [year, month] = dateStr.split('/')

    if (!acc[year]) {
      acc[year] = {}
    }

    if (!acc[year][month]) {
      acc[year][month] = {
        categories: categories.map(category => ({
          name: category.name,
          id: category.id,
          user: category.user,
          transactions: category.transactions.filter(t => {
            const transDate = new Date(t.date)
            return transDate.getFullYear() === parseInt(year) &&
                       (transDate.getMonth() + 1) === parseInt(month)
          })
        }))
      }
    }

    return acc
  }, {})

  // Sort years and months in descending order
  const sortedDescending = Object.keys(sortedByYearAndMonth)
    .sort((a, b) => b - a)
    .reduce((acc, year) => {
      acc[year] = Object.keys(sortedByYearAndMonth[year])
        .sort((a, b) => b - a)
        .reduce((monthAcc, month) => {
          monthAcc[month] = sortedByYearAndMonth[year][month]
          return monthAcc
        }, {})
      return acc
    }, {})

  const addedStatisticsData = calculateSpecifiedValues(sortedDescending)

  return addedStatisticsData
}

const calculateSpecifiedValues = (data) => {
  Object.entries(data).forEach(([year, yearData]) => {
    Object.entries(yearData).forEach(([month, monthData]) => {
      let monthlyTotal = 0
      let amountOfMonthlyExpenses = 0

      monthData.categories.forEach(category => {
        const categoryTotal = (category.transactions).reduce(
          (sum, transaction) => sum + (transaction.sum),
          0
        )

        category.totalCosts = categoryTotal
        category.averageCosts = parseFloat((categoryTotal/category.transactions.length).toFixed(2))

        monthlyTotal += categoryTotal
        amountOfMonthlyExpenses += category.transactions.length
      })

      monthData.totalMonthlyCosts = monthlyTotal
      monthData.amountOfMonthlyExpenses = amountOfMonthlyExpenses
      monthData.averageMonthlyCost = parseFloat((monthlyTotal/amountOfMonthlyExpenses).toFixed(2))
    })
  })

  return data
}
