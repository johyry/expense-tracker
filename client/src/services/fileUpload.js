import axios from 'axios'

const baseUrl = '/api/file/upload'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const upload = async (file) => {
  const formData = new FormData()

  formData.append('file', file)

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: token,
    },
  }
  const response = await axios.post(baseUrl, formData, config)
  return response.data
}

export default {
  upload,
  setToken,
}
