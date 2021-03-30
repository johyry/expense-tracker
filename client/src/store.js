import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'
import transactionReducer from './reducers/transactionReducer'

const reducer = combineReducers({
  notification: notificationReducer,
  login: loginReducer,
  transactions: transactionReducer,
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store
