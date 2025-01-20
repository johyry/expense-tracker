import * as React from 'react'
import { PieChart } from '@mui/x-charts/PieChart'
import colors from '../Styles/Charts'

const valueFormatter = (item) => {
  return `${item.value} %`
}

const Pie = ({ categories, categoryOverviewValues }) => {
  const data = calculateCategoryValuesForPie(categories, categoryOverviewValues)

  return (
    <PieChart
      colors={colors}
      series={[
        {
          arcLabelMinAngle: 35,
          arcLabelRadius: '60%',
          data,
          valueFormatter
        }
      ]}
      width={400}
      height={200}
    />
  )
}

const calculateCategoryValuesForPie = (categories, categoryOverviewValues) => {
  return categories.map((category) => {
    const newObj = { ...category }
    newObj.totalSum = category.transactions.reduce((acc, transaction) => acc + transaction.sum, 0)
    newObj.amountOfTransactions = category.transactions.length
    if (newObj.totalSum !== 0) {
      newObj.value = ((newObj.totalSum / categoryOverviewValues.totalAmount) * 100).toFixed(2)
      newObj.averageSum = newObj.totalSum / newObj.amountOfTransactions
    } else {
      newObj.value = 0
      newObj.averageSum = 0
    }
    newObj.label = category.name
    return newObj
  })
}

export default Pie
