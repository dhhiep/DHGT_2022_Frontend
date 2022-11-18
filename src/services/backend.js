import { apiCaller } from '@/services/api';

export const increaseCounterOnline = () => {
  return apiCaller('POST', '/api/register', {}, { attachApiKey: false });
};

export const updateSettings = (settings) => {
  const params = {
    max_counter: settings.maxCounter,
    ratio: settings.ratio,
  };

  return apiCaller('POST', '/api/updateconfig', params);
};

export const resetCounter = () => {
  return apiCaller('POST', '/api/reset');
};
