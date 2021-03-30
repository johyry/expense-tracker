import axios from 'axios'

const baseUrl = '/api/transaction'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  console.log('do we have a token?', token)
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get(baseUrl, config)
  return response.data
}

export default { getAll, setToken }
