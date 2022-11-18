import { apiCaller } from '@/services/api';

export const increaseCounterOnline = () => {
  return apiCaller('POST', '/api/register', {}, { attachApiKey: false });
};

export const resetCounter = () => {
  return apiCaller('POST', '/api/reset');
};
