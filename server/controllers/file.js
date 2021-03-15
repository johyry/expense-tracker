const fs = require('fs')
const fileRouter = require('express').Router()
const multer = require('multer')

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

const upload = multer({ storage, fileFilter })

fileRouter.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).send({ message: 'Please upload a file!' })
    }

    res.status(200).send({
      message: `Uploaded the file successfully:  + ${req.file.originalname}`,
    })
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(500).send({
        message: 'File size cannot be larger than 2MB!',
      })
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    })
  }
})

fileRouter.get('/files', (req, res) => {
  const directoryPath = `${__basedir} /resources/static/assets/uploads/`
  const baseUrl = 'http://localhost:3002/api/files/'

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.status(500).send({
        message: 'Unable to scan files!',
      })
    }

    const fileInfos = []

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      })
    })

    res.status(200).send(fileInfos)
  })
})

fileRouter.get('/files/:name', (req, res) => {
  const fileName = req.params.name
  const directoryPath = `${__basedir} /resources/static/assets/uploads/`

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: `Could not download the file.  + ${err}`,
      })
    }
  })
})

module.exports = fileRouter
