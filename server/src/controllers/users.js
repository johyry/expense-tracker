const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  try {
    const { body } = request

    if (body.password.length < 4) {
      return response.status(400).json({ error: 'password must be over 3 characters' })
    }

    if (await User.findOne({ username: body.username })) {
      return response.status(400).json({ error: 'Username already exists.' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users.map((u) => u.toJSON()))
})

module.exports = usersRouter
