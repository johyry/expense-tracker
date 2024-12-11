require('dotenv').config()
const path = require('path')

const PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

const basedir = path.resolve()

module.exports = {
  MONGODB_URI,
  PORT,
  basedir
}
