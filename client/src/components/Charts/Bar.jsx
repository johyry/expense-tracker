import * as React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import colors from '../Styles/Charts'

const valueFormatter = (value) => {
  return `${value} €`
}

const Barchart = ({ monthlyData, averageCategoryCosts }) => {

  let dataObj = [{}]
  let series = []
  let height
  let width

  if (monthlyData) {
    monthlyData.categories.forEach((category) => {
      dataObj[0][category.name] = category.totalCosts
      series.push({ dataKey: category.name, label: category.name, valueFormatter })
    })
    height = 250
    width = 400
  } else if (averageCategoryCosts) {
    averageCategoryCosts.forEach((category) => {
      dataObj[0][category.name] = category.average
      series.push({ dataKey: category.name, label: category.name, valueFormatter })
    })
    height = 400
    width = 600
  }

  return (
    <BarChart
      height={height}
      width={width}
      colors={colors}
      dataset={dataObj}
      xAxis={[{ scaleType: 'band', data: [' '], }]}
      yAxis={[{ valueFormatter }]}
      series={series}
    >
    </BarChart>
  )
}

export default Barchart