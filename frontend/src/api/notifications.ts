import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL || 'https://groupdbackend.mangocoast-8ddfce7d.southeastasia.azurecontainerapps.io'

const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

export const getNotifications = () => axios.get(`${BASE_URL}/api/notifications`, { headers: getAuthHeader() })
export const markNotificationRead = (id: string) => axios.patch(`${BASE_URL}/api/notifications/${id}/read`, {}, { headers: getAuthHeader() })
export const markAllRead = () => axios.patch(`${BASE_URL}/api/notifications/read-all`, {}, { headers: getAuthHeader() })
