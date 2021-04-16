import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Notification from './components/Misc/Notification'
import LoginPanel from './components/Login/LoginPage'
import { checkForAlreadyLoggedInUser } from './reducers/loginReducer'
import { initializeTransactions } from './reducers/transactionReducer'
import FileUploadPage from './components/FileUpload/FileUpload'
import TransactionsMain from './components/Transactions/TransactionsMain'
import Home from './components/Home'
import NavBar from './components/NavBar/NavBar'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkForAlreadyLoggedInUser())
    dispatch(initializeTransactions())
  }, [dispatch])

  return (
    <div>
      <div>
        <NavBar />
      </div>

      <Notification />

      <Switch>
        <Route path="/transactions">
          <TransactionsMain />
        </Route>
        <Route path="/login">
          <LoginPanel />
        </Route>
        <Route path="/pdfupload">
          <FileUploadPage />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  )
}

export default App
