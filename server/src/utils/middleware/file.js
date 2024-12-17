const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = { fileFilter }
