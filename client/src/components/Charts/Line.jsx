import { LineChart } from '@mui/x-charts/LineChart'
import { useSelector } from 'react-redux'
import colors from '../Styles/Charts'

const Linechart = ({ sortedCategories }) => {
  const categories = useSelector((state) => state.categories)

  const data = formatLinechartData(sortedCategories)

  return (
    <LineChart
      colors={colors}
      dataset={data}
      xAxis={[
        {
          id: 'Years',
          dataKey: 'date',
          scaleType: 'point',
          valueFormatter: (date) => date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit' })
        },
      ]}
      series={categories.map((category) => {
        return (
          {
            id: category.name,
            label: category.name,
            dataKey: category.name,
            stack: 'total',
            area: true,
            showMark: false
          }
        )
      })}
      width={600}
      height={400}
      margin={{ left: 70 }}
    />
  )
}

const formatLinechartData = (data) => {
  let newData = []

  Object.entries(data).forEach(([year, yearData]) => {
    Object.entries(yearData).forEach(([month, monthData]) => {
      let dataPoint = {
        date: new Date(year, month - 1, 1)
      }

      monthData.categories.forEach(category => {
        const totalCosts = category.totalCosts
        dataPoint[category.name] = totalCosts
      })

      newData.push(dataPoint)
    })
  })

  return newData
}

export default Linechart