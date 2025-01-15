const categoryRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware/middleware')
const Category = require('../models/category')

categoryRouter.get('/', userExtractor, async (request, response) => {
  const user = request.user

  const categories = await Category.find({ user })
    .populate('user', { username: 1 })
    .populate('transactions')
  response.json(categories)
})

categoryRouter.get('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const id = request.params.id

  const category = await Category.findById(id)
    .populate('user', { username: 1 })
    .populate('transactions')

  if (user.id !== category.user.id) return response.status(401).json({ error: 'Wrong user.' })

  response.json(category)
})

categoryRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const body = request.body

  const category = new Category({
    name: body.name,
    user: user.id
  })

  const savedCategory = await category.save()

  response.json(savedCategory)
})

categoryRouter.delete('/:id', userExtractor, async (request, response) => {
  const categoryToDelete = await Category.findById(request.params.id)
  const user = request.user

  if (!categoryToDelete) return response.status(404).json({ error: 'Category not found.' })

  if (user.id.toString() !== categoryToDelete.user.toString()) return response.status(401).json({ error: 'Wrong user.' })

  await Category.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

categoryRouter.put('/:id', userExtractor, async (request, response) => {
  const categoryCheck = await Category.findById(request.params.id)

  if (!categoryCheck) {
    return response.status(404).json({ error: 'Category not found' })
  }

  if (categoryCheck.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'Invalid user' })
  }

  const updatedCategory = await Category.findByIdAndUpdate(request.params.id,
    request.body,
    { new: true }
  )

  response.json(updatedCategory)
})

module.exports = categoryRouter