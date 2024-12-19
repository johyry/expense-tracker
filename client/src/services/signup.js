import axios from 'axios'

const baseUrl = '/api/users'

export const createUser = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}
