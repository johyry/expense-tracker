import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Notification from './components/Misc/Notification'
import LoginPage from './components/Login/Login'
import CreateUser from './components/CreateUser/CreateUser'
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

      <Routes>
        <Route path="/transactions" element={<TransactionsMain />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/pdfupload" element={<FileUploadPage />}/>
        <Route path="/register" element={<CreateUser />}/>
        <Route path="/" element={<Home />}/>
      </Routes>
    </div>
  )
}

export default App
