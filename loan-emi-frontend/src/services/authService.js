import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const loginUser = async (credentials) => {
  const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};