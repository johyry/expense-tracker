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

transactionRouter.get('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const id = request.params.id

  const transaction = await Transaction.findById(id).populate('user', {
    username: 1,
  })

  if (user.id !== transaction.user.id) return response.status(401).json({ error: 'Wrong user.' })

  response.json(transaction)
})

transactionRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const body = request.body

  const transaction = new Transaction({
    sum: body.sum,
    kind: body.kind,
    date: body.date,
    type: body.type,
    category: body.category,
    receiver: body.receiver,
    comment: body.comment,
    user: user.id
  })
  const result = await transaction.save()
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
  const transactionCheck = await Transaction.findById(request.params.id)

  if (transactionCheck.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'Invalid token' })
  }
  const transaction = await Transaction.findByIdAndUpdate(request.params.id,
    request.body,
    { new: true }
  )

  response.json(transaction.toJSON())
})

module.exports = transactionRouter
