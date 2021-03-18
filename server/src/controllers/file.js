const fs = require('fs')
const fileRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const transactionParser = require('../bankstatementParser/parser')
const transactionSaver = require('../utils/transactionsaver')
const User = require('../models/user')
const fileSaver = require('../utils/middleware/fileSaver')

fileRouter.post('/upload', async (req, res) => {
  try {
    const token = req.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    // uploads the file to temporar folder to be processed
    await fileSaver.uploader(req, res)

    if (req.file === undefined) {
      return res.status(400).send({ message: 'Please upload a file!' })
    }

    const pathToFile = `${__basedir}/resources/static/assets/uploads/${req.file.originalname}`

    // Parse pdf and get transactions
    const transactions = await transactionParser.parser(pathToFile)

    // Deletes pdf after parse
    fs.unlinkSync(pathToFile)

    // Save transactions to mongodb with user reference
    const savedTransactions = await transactionSaver(transactions, user)
    const savedTransactionsIds = savedTransactions.map((t) => t._id)

    // Add references to user and save users information to db
    user.transactions = user.transactions.concat(savedTransactionsIds)
    await user.save()

    res.status(200).send({
      message: `Uploaded the file and transactions successfully: ${req.file.originalname}`,
    })
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    })
  }
})

module.exports = fileRouter
