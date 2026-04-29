import api from './axiosInstance';

export const getNotifications = () => api.get('/api/notifications');
export const markNotificationRead = (id: string) => api.patch(`/api/notifications/${id}/read`);
export const markAllRead = () => api.patch('/api/notifications/read-all');
