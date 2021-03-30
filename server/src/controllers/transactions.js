const transactionRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const { Transaction } = require('../models/transaction')
const User = require('../models/user')

transactionRouter.get('/', async (request, response) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const transactions = await Transaction.find({ user }).populate('user', {
    username: 1,
  })

  console.log(transactions)
  response.json(transactions)
})

module.exports = transactionRouter
