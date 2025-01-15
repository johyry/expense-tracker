const transactionRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware/middleware')
const { Transaction } = require('../models/transaction')
const Category = require('../models/category')

transactionRouter.get('/', userExtractor, async (request, response) => {
  const user = request.user

  const transactions = await Transaction.find({ user })
    .populate('user', { username: 1 })
    .populate('category')
  response.json(transactions)
})

transactionRouter.get('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const id = request.params.id

  const transaction = await Transaction.findById(id)
    .populate('user', { username: 1 })
    .populate('category')

  if (user.id !== transaction.user.id) return response.status(401).json({ error: 'Wrong user.' })

  response.json(transaction)
})

transactionRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const body = request.body

  const category = body.category
  if (!category) {
    return response.status(400).json({ error: 'Invalid category' })
  }


  const transaction = new Transaction({
    sum: body.sum,
    kind: body.kind,
    date: body.date,
    type: body.type,
    category: category.id,
    receiver: body.receiver,
    comment: body.comment,
    user: user.id
  })

  const savedTransaction = await transaction.save()

  const catToSave = await Category.findById(category.id)
  catToSave.transactions.push(savedTransaction._id)
  await catToSave.save()

  response.json(savedTransaction)
})

transactionRouter.delete('/:id', userExtractor, async (request, response) => {
  const transactionToDelete = await Transaction.findById(request.params.id)
  const user = request.user

  if (!transactionToDelete) return response.status(404).json({ error: 'Transaction not found.' })

  if (transactionToDelete.user.toString() === user.id.toString()) {
    await Transaction.findByIdAndDelete(request.params.id)

    const category = await Category.findById(transactionToDelete.category)
    category.transactions = category.transactions.filter(t => t.toString() !== transactionToDelete._id.toString())
    await category.save()

    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'token invalid' })
  }

})

transactionRouter.put('/:id', userExtractor, async (request, response) => {
  const transactionCheck = await Transaction.findById(request.params.id)

  if (!transactionCheck) {
    return response.status(404).json({ error: 'Transaction not found' })
  }

  if (transactionCheck.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'Invalid user' })
  }

  const transaction = { ...request.body, category: request.body.category.id }
  const oldTransaction = await Transaction.findById(request.params.id)
  const savedTransaction = await Transaction.findByIdAndUpdate(request.params.id,
    transaction,
    { new: true }
  )

  const oldCategory = await Category.findById(oldTransaction.category)
  const category = await Category.findById(savedTransaction.category)

  oldCategory.transactions = oldCategory.transactions.filter(t => t.toString() !== savedTransaction.id.toString())
  category.transactions.push(savedTransaction.id)

  await oldCategory.save()
  await category.save()

  response.json(savedTransaction.toJSON())
})

module.exports = transactionRouter
