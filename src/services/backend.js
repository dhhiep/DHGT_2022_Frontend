import { apiCaller } from '@/services/api';

export const increaseCounterOnline = () => {
  return apiCaller('POST', '/api/register');
};

export const resetCounter = () => {
  return apiCaller('POST', '/api/reset');
};
