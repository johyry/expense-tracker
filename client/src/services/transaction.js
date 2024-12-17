import axios from 'axios'

const baseUrl = '/api/transaction'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get(baseUrl, config)
  return response.data
}

const changeCategory = async (details) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log('details at service:', details.category)
  const response = await axios.put(
    baseUrl.concat('/', details.id),
    { category: details.category },
    config
  )
  console.log('response from service:', response.data)
  return response.data
}

export default { getAll, setToken, changeCategory }