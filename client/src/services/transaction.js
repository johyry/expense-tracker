import axios from 'axios'

const baseUrl = '/api/transaction'

let config = null
const setConfig = (newToken) => {
  const token = `bearer ${newToken}`
  config = {
    headers: { Authorization: token },
  }
}

const createTransaction = async (newTransaction) => {
  const response = await axios.post(baseUrl, newTransaction, config)
  return response.data
}

const getAll = async () => {
  const response = await axios.get(baseUrl, config)
  return response.data
}

const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, config)
  return response.data
}

const deleteTransaction = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const updateTransaction = async (details) => {
  const response = await axios.put(`${baseUrl}/${details.mongoId}`,
    details,
    config
  )
  return response.data
}

export default { createTransaction, getAll, getById, setConfig, updateTransaction, deleteTransaction }
