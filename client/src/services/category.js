import axios from 'axios'

const baseUrl = '/api/category'

let config = null
const setConfig = (newToken) => {
  const token = `bearer ${newToken}`
  config = {
    headers: { Authorization: token },
  }
}

const createCategory = async (newCategory) => {
  const response = await axios.post(baseUrl, newCategory, config)
  return response.data
}

const getAll = async () => {
  const response = await axios.get(baseUrl, config)
  return response.data
}

const getAllSortedCategories = async () => {
  const response = await axios.get(`${baseUrl}/sortedByYearAndMonth`, config)
  return response.data
}

const deleteCategory = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const updateCategory = async (details) => {
  const response = await axios.put(`${baseUrl}/${details.id}`,
    details,
    config
  )
  return response.data
}

export default { createCategory, getAll, getAllSortedCategories, setConfig, updateCategory, deleteCategory }