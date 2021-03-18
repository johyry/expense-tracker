const multer = require('multer')
const util = require('util')

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

module.exports = { uploader }
