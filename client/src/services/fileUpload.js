import axios from 'axios'

const baseUrl = '/api/file/upload'

const upload = async (file) => {
  const formData = new FormData()

  formData.append('file', file)

  const headers = {
    'Content-Type': 'multipart/form-data',
  }

  const response = await axios.post(baseUrl, formData, {
    headers,
  })
  return response.data
}

export default {
  upload,
}
