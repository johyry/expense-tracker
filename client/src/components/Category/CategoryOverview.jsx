import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { CategoryCard } from './CategoryCard'
import { Grid2 } from '@mui/material'

const CategoryOverview = () => {
  const categories  = useSelector((state) => state.categories)

  return (
    <div>
      <h2>Transaction categories:</h2>
      <Grid2 container spacing={2} sx={{ padding: 2 }}>
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </Grid2>
    </div>
  )
}

export default CategoryOverview
