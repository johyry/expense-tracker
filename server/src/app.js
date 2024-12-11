const express = require('express')
require('express-async-errors')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware/middleware')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const fileRouter = require('./controllers/file')
const transactionRouter = require('./controllers/transactions')
const logger = require('./utils/logger')
const { basedir } = require('./utils/config')

const app = express()

console.log('works?', basedir)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)

app.use(middleware.tokenExtractor)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/file', fileRouter)
app.use('/api/transaction', transactionRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
