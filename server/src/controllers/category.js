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

categoryRouter.get('/sortedByYearAndMonth', userExtractor, async (request, response) => {
  const user = request.user

  const categories = await Category.find({ user })
    .populate('user', { username: 1 })
    .populate('transactions')

  const sortedCategories = sortCategoriesByDate(categories)

  console.log(sortedCategories)

  response.json(sortedCategories)
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

  if (!request.body.name || request.body.name.length < 3) {
    return response.status(400).json({ error: 'Category name is too short' })
  }

  categoryCheck.name = request.body.name

  const updatedCategory = await Category.findByIdAndUpdate(request.params.id,
    categoryCheck,
    { new: true }
  ).populate('user', { username: 1 })
    .populate('transactions')

  response.json(updatedCategory)
})

const sortCategoriesByDate = (categories) => {
  // Get all unique transactions dates as YYYY/MM
  const dates = categories.flatMap(category =>
    category.transactions.map(t => {
      const date = new Date(t.date)
      return `${date.getFullYear()}/${String(date.getMonth() + 1)}`
    })
  ).filter((date, index, self) => self.indexOf(date) === index)

  // Create sorted object
  const sorted = dates.reduce((acc, dateStr) => {
    const [year, month] = dateStr.split('/')

    if (!acc[year]) {
      acc[year] = {}
    }

    if (!acc[year][month]) {
      acc[year][month] = {
        categories: categories.map(category => ({
          name: category.name,
          id: category.id,
          user: category.user,
          transactions: category.transactions.filter(t => {
            const transDate = new Date(t.date)
            return transDate.getFullYear() === parseInt(year) &&
                     (transDate.getMonth() + 1) === parseInt(month)
          })
        }))
      }
    }

    return acc
  }, {})

  // Sort years and months in descending order
  return Object.keys(sorted)
    .sort((a, b) => b - a)
    .reduce((acc, year) => {
      acc[year] = Object.keys(sorted[year])
        .sort((a, b) => b - a)
        .reduce((monthAcc, month) => {
          monthAcc[month] = sorted[year][month]
          return monthAcc
        }, {})
      return acc
    }, {})
}


module.exports = categoryRouter