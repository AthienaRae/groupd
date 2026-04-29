import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL || 'https://groupdbackend.mangocoast-8ddfce7d.southeastasia.azurecontainerapps.io'

const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

export const getConversations = () => axios.get(`${BASE_URL}/api/messages/conversations`, { headers: getAuthHeader() })
export const getConversation = (userId: string) => axios.get(`${BASE_URL}/api/messages/conversation/${userId}`, { headers: getAuthHeader() })
export const sendMessage = (receiverId: string, content: string) =>
  axios.post(`${BASE_URL}/api/messages/send`, { receiver_id: receiverId, content }, { headers: getAuthHeader() })
