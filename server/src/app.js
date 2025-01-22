const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const config = require('./utils/config')
const middleware = require('./utils/middleware/middleware')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const fileRouter = require('./controllers/file')
const transactionRouter = require('./controllers/transactions')
const logger = require('./utils/logger')
const categoryRouter = require('./controllers/category')
const app = express()

const distPath = path.join(__dirname, '..', 'dist')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })


app.use(express.json())
app.use(cors())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/file', fileRouter)
app.use('/api/transaction', transactionRouter)
app.use('/api/category', categoryRouter)

app.use(express.static(distPath))

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
