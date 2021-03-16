const fs = require('fs')
const util = require('util')
const fileRouter = require('express').Router()
const multer = require('multer')
const transactionParser = require('../bankstatementParser/parser')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__basedir}/resources/static/assets/uploads/`)
  },
  filename: (req, file, cb) => {
    console.log(file.originalname)
    cb(null, file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  console.log(file)
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
    await uploader(req, res)

    if (req.file === undefined) {
      return res.status(400).send({ message: 'Please upload a file!' })
    }

    const pathToFile = `${__basedir}/resources/static/assets/uploads/${req.file.originalname}`

    // Parse pdf and get transactions
    const transactions = await transactionParser.parser(pathToFile)

    // Remove pdf
    fs.unlinkSync(pathToFile)

    res.status(200).send({
      data: transactions,
      message: `Uploaded the file successfully: ${req.file.originalname}`,
    })
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    })
  }
})

module.exports = fileRouter
