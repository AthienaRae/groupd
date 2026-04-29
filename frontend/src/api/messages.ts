import api from './axiosInstance';

export const getConversations = () => api.get('/api/messages/conversations');
export const getConversation = (userId: string) => api.get(`/api/messages/conversation/${userId}`);
export const sendMessage = (receiverId: string, content: string) =>
  api.post('/api/messages/send', { receiver_id: receiverId, content });
