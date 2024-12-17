const transactionRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware/middleware')
const { Transaction } = require('../models/transaction')
const { v4: uuidv4 } = require('uuid')

transactionRouter.get('/', userExtractor, async (request, response) => {
  const user = request.user

  const transactions = await Transaction.find({ user }).populate('user', {
    username: 1,
  })
  response.json(transactions)
})

transactionRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const body = request.body
  console.log(body)

  const transaction = new Transaction({
    sum: body.sum,
    kind: body.kind,
    date: body.date,
    type: body.type,
    category: body.category,
    receiver: body.receiver,
    user: user.id
  })
  const result = await transaction.save()
  console.log(result)
  response.json(result)
})

transactionRouter.delete('/:id', userExtractor, async (request, response) => {
  const transactionToDelete = await Transaction.findById(request.params.id)
  const user = request.user

  if (!transactionToDelete) return response.status(404).json({ error: 'Transaction not found.' })

  if (transactionToDelete.user.toString() === user.id.toString()) {
    await Transaction.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'token invalid' })
  }

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
