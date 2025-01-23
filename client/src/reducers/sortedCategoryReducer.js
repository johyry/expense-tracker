import categoryService from '../services/category'
import { handleNotifications } from './notificationReducer'
import { createSlice } from '@reduxjs/toolkit'

export const sortedCategorySlice = createSlice({
  name: 'sortedCategory',
  initialState: [],
  reducers: {
    initialize: (state, action) => {
      return (action.payload)
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

export const { initialize } = sortedCategorySlice.actions

export default sortedCategorySlice.reducer