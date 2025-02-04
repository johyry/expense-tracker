import categoryService from '../services/category'
import { handleNotifications } from './notificationReducer'
import { createSlice } from '@reduxjs/toolkit'
import { sortCategoriesByDate } from '../utils/CategorySorter'

export const sortedCategorySlice = createSlice({
  name: 'sortedCategory',
  initialState: [],
  reducers: {
    initialize: (state, action) => {
      return (action.payload)
    },
    modify: (state, action) => {
      return action.payload
    }
  }
})

export const initializeSortedCategories = () => async (dispatch) => {
  try {
    const sortedCategories = await categoryService.getAllSortedCategories()
    dispatch(initialize(sortedCategories))
  } catch (exception) {
    handleNotifications('Fetching all categories failed', 'error')
  }
}

export const updateSortedCategories = (categories) => (dispatch) => {
  try {
    const sortedCategories = sortCategoriesByDate(categories)
    dispatch(initialize(sortedCategories))
  } catch (exception) {
    handleNotifications('Updating categories failed', 'error')
  }
}

export const { initialize, modify } = sortedCategorySlice.actions

export default sortedCategorySlice.reducer

