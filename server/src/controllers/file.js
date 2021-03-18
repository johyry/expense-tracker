const fs = require('fs')
const util = require('util')
const fileRouter = require('express').Router()
const multer = require('multer')
const jwt = require('jsonwebtoken')

const transactionParser = require('../bankstatementParser/parser')
const transactionSaver = require('../utils/transactionsaver')
const User = require('../models/user')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__basedir}/resources/static/assets/uploads/`)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({ storage, fileFilter }).single('file')
const uploader = util.promisify(upload)

fileRouter.post('/upload', async (req, res) => {
  try {
    const token = req.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    // uploads the file to temporar folder to be processed
    await uploader(req, res)

    if (req.file === undefined) {
      return res.status(400).send({ message: 'Please upload a file!' })
    }

    const pathToFile = `${__basedir}/resources/static/assets/uploads/${req.file.originalname}`

    // Parse pdf and get transactions
    const transactions = await transactionParser.parser(pathToFile)

    // Remove pdf
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
