import { configureStore } from '@reduxjs/toolkit'

import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'
import transactionReducer from './reducers/transactionReducer'
import categoryReducer from './reducers/categoryReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    login: loginReducer,
    transactions: transactionReducer,
    categories: categoryReducer,
  }
})


export default store
