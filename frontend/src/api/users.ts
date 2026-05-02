import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL || 'https://groupdbackend.mangocoast-8ddfce7d.southeastasia.azurecontainerapps.io'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export interface User {
  id: string
  name: string
  email: string
  department?: string
  availability?: string
  about?: string
  skills?: string[]
  avatar_url?: string
  resume_url?: string
}

export const getUser = async (userId: string): Promise<User> => {
  const res = await axios.get(`${BASE_URL}/api/users/${userId}`, {
    headers: getAuthHeader()
  })
  return res.data
}

export const updateUser = async (userId: string, data: Partial<User>): Promise<User> => {
  const res = await axios.put(`${BASE_URL}/api/users/${userId}`, data, {
    headers: getAuthHeader()
  })
  return res.data
}
