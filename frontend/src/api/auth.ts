import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL || 'https://groupdbackend.mangocoast-8ddfce7d.southeastasia.azurecontainerapps.io'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const res = await axios.post(`${BASE_URL}/login`, payload)
  return res.data
}

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const res = await axios.post(`${BASE_URL}/register`, payload)
  return res.data
}

export const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
