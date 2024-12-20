const fs = require('fs')
const fileRouter = require('express').Router()
const multer = require('multer')
const { fileFilter } = require('../utils/middleware/file')
const upload = multer({ dest: 'resources/static/assets/uploads/', fileFilter })
const transactionParser = require('../bankstatementParser/parser')
const transactionSaver = require('../utils/transactionsaver')
const { userExtractor } = require('../utils/middleware/middleware')

fileRouter.post('/upload', [userExtractor, upload.single('file')], async (req, res) => {
  try {
    const user = req.user

    if (req.file === undefined) {
      return res.status(400).send({ message: 'Please upload a file!' })
    }

    const pathToFile = `resources/static/assets/uploads/${req.file.filename}`

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
