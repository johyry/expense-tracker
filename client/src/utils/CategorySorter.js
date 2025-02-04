export const sortCategoriesByDate = (categories) => {
  // Get all unique transactions dates as YYYY/MM
  const dates = categories.flatMap(category =>
    category.transactions.map(t => {
      const date = new Date(t.date)
      return `${date.getFullYear()}/${String(date.getMonth() + 1)}`
    })
  ).filter((date, index, self) => self.indexOf(date) === index)

  // Create sorted object
  const sorted = dates.reduce((acc, dateStr) => {
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
  return Object.keys(sorted)
    .sort((a, b) => b - a)
    .reduce((acc, year) => {
      acc[year] = Object.keys(sorted[year])
        .sort((a, b) => b - a)
        .reduce((monthAcc, month) => {
          monthAcc[month] = sorted[year][month]
          return monthAcc
        }, {})
      return acc
    }, {})
}