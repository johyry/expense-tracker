import * as React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import colors from '../Styles/Charts'

const valueFormatter = (value) => {
  return `${value} €`
}

const Barchart = ({ monthlyData }) => {

  let dataObj = [{}]
  let series = []

  monthlyData.categories.forEach((category) => {
    dataObj[0][category.name] = category.totalCosts
    series.push({ dataKey: category.name, label: category.name, valueFormatter })
  })

  return (
    <BarChart
      height={250}
      width={400}
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