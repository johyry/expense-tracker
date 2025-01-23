import categoryService from '../services/category'
import { handleNotifications } from './notificationReducer'
import { createSlice } from '@reduxjs/toolkit'

export const categorySlice = createSlice({
  name: 'category',
  initialState: [],
  reducers: {
    add: (state, action) => {
      return (state.concat(action.payload))
    },
    deleteTr: (state, action) => {
      return state.filter((category) => category.mongoId !== action.payload)
    },
    initialize: (state, action) => {
      return (action.payload)
    },
    modify: (state, action) => { // action.payload = { category, year, month}
      const { category, year, month } = action.payload
      const categories = state[year][month].categories.map((c) => c.id === category.id ? category : c)
      state[year][month].categories = categories
      return state
    }
  }
})

export const addCategory = (newCategory) => async (dispatch) => {
  const category = await categoryService.createCategory(newCategory)
  dispatch(add(category))
  return category
}

export const deleteCategory = (id) => async (dispatch) => {
  const success = await categoryService.deleteCategory(id)
  dispatch(deleteTr(id))
  return success
}

export const initializeCategories = () => async (dispatch) => {
  try {
    const categories = await categoryService.getAll()
    const sortedCategories = await categoryService.getAllSortedCategories()
    dispatch(initialize(sortedCategories))
  } catch (exception) {
    handleNotifications('Fetching all categories failed', 'error')
  }
}

export const updateCategory = (details) => async (dispatch) => {
  const newCategory = await categoryService.updateCategory(details)
  dispatch(modify(newCategory))
  return newCategory
}

export const { add, initialize, modify, deleteTr } = categorySlice.actions

export default categorySlice.reducer