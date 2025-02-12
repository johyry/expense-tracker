import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Notification from './components/Misc/Notification'
import { checkForAlreadyLoggedInUser } from './reducers/loginReducer'
import { initializeTransactions } from './reducers/transactionReducer'
import TransactionsMain from './components/Transactions/TransactionsMain'
import TransactionForm from './components/Transactions/TransactionForm'
import Home from './components/Home'
import NavBar from './components/NavBar/NavBar'
import AuthPage from './components/Login/AuthPage'
import { useSelector } from 'react-redux'
import { initializeCategories } from './reducers/categoryReducer'
import { updateSortedCategories } from './reducers/sortedCategoryReducer'
import { Grid2 } from '@mui/material'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.login)
  const categories = useSelector((state) => state.categories)
  const sortedCategories = useSelector((state) => state.sortedCategories)

  useEffect(() => {
    if (user.username) {
      dispatch(initializeTransactions())
      dispatch(initializeCategories())
    } else {
      dispatch(checkForAlreadyLoggedInUser())
    }
  }, [dispatch, user])

  useEffect(() => {
    if (categories.length !== 0) {
      dispatch(updateSortedCategories(categories))
    }
  }, [dispatch, categories])

  return (
    <div>
      <Grid2 sx={{ paddingLeft: 2, paddingRight: 2 }}>
        <NavBar />
      </Grid2>

      <Notification />

      <Routes>
        <Route path="/transactions" element={<TransactionsMain />}/>
        <Route path="/transactions/new" element={<TransactionForm />}/>
        <Route path="/transactions/edit/:id" element={<TransactionForm />}/>
        <Route path="/login" element={<AuthPage isRegister={false} />}/>
        {/*<Route path="/pdfupload" element={<FileUploadPage />}/>*/}
        <Route path="/register" element={<AuthPage isRegister={true} />}/>
        <Route path="/" element={<Home />}/>
      </Routes>
    </div>
  )
}

export default App
