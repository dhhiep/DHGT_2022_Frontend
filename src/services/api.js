import axios from 'axios';

export const apiCaller = (method, path, data = {}) => {
  const axiosDefaultSetting = defaultAxiosDefaultSetting(method, path, data);

  return axios(axiosDefaultSetting);
};

const defaultAxiosDefaultSetting = (method, path, data = {}) => {
  const apiEndpoint = process.env.VUE_APP_BACKEND_URL;

  let axiosSetting = {
    method: method,
    url: apiEndpoint + path,
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  // Set request parameter or body
  if (method == 'get') {
    axiosSetting.params = data;
  } else {
    axiosSetting.data = data;
  }

  return axiosSetting;
};
