const transactionRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware/middleware')
const { Transaction } = require('../models/transaction')

transactionRouter.get('/', userExtractor, async (request, response) => {
  const user = request.user

  const transactions = await Transaction.find({ user }).populate('user', {
    username: 1,
  })

  response.json(transactions)
})

transactionRouter.put('/:id', userExtractor, async (request, response) => {
  const body = request.body
  const transaction = await Transaction.findById(request.params.id)
  transaction.category = body.category

  if (transaction.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'Invalid token' })
  }

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    request.params.id,
    transaction,
    { new: true },
  )
  response.json(updatedTransaction.toJSON())
})

module.exports = transactionRouter
