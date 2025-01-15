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
    modify: (state, action) => {
      console.log('existing state', state)
      console.log('action.payload', action.payload)
      console.log('modified state', state.map((category) => {
        console.log('category.mongoId', category)
        console.log('action.payload.mongoId', action.payload)
        return category.mongoId === action.payload.mongoId ? action.payload : category}))
      return state.map((category) => category.mongoId === action.payload.mongoId ? action.payload : category)
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
    dispatch(initialize(categories))
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