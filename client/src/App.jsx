import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Notification from './components/Misc/Notification'
import { checkForAlreadyLoggedInUser } from './reducers/loginReducer'
import { initializeTransactions } from './reducers/transactionReducer'
import FileUploadPage from './components/FileUpload/FileUpload'
import TransactionsMain from './components/Transactions/TransactionsMain'
import NewTransaction from './components/Transactions/NewTransaction'
import Home from './components/Home'
import NavBar from './components/NavBar/NavBar'
import AuthPage from './components/Login/AuthPage'

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

      <Routes>
        <Route path="/transactions" element={<TransactionsMain />}/>
        <Route path="/transactions/new" element={<NewTransaction />}/>
        <Route path="/login" element={<AuthPage isRegister={false} />}/>
        <Route path="/pdfupload" element={<FileUploadPage />}/>
        <Route path="/register" element={<AuthPage isRegister={true} />}/>
        <Route path="/" element={<Home />}/>
      </Routes>
    </div>
  )
}

export default App
