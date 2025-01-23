import { configureStore } from '@reduxjs/toolkit'

import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'
import transactionReducer from './reducers/transactionReducer'
import categoryReducer from './reducers/categoryReducer'
import sortedCategoryReducer from './reducers/sortedCategoryReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    login: loginReducer,
    transactions: transactionReducer,
    categories: categoryReducer,
    sortedCategories: sortedCategoryReducer,
  }
})


export default store
