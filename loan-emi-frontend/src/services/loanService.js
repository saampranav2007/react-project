import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const saveLoanCalculation = async (loanData) => {
  const response = await api.post(API_ENDPOINTS.CALCULATE_LOAN, loanData);
  return response.data;
};

export const getLoanHistory = async (userId) => {
  const response = await api.get(`${API_ENDPOINTS.LOAN_HISTORY}/${userId}`);
  return response.data;
};