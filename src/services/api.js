import axios from 'axios';

export const apiCaller = (method, path, data = {}, options = {}) => {
  const axiosDefaultSetting = defaultAxiosDefaultSetting(method, path, data, options);

  return axios(axiosDefaultSetting);
};

const defaultAxiosDefaultSetting = (method, path, data = {}, options = {}) => {
  const apiEndpoint = process.env.VUE_APP_BACKEND_URL;

  let axiosSetting = {
    method: method,
    url: apiEndpoint + path,
    withCredentials: false,
    headers: headers(options),
  };

  // Set request parameter or body
  if (method == 'get') {
    axiosSetting.params = data;
  } else {
    axiosSetting.data = data;
  }

  return axiosSetting;
};

const headers = (options = {}) => {
  if (options.attachApiKey == null) {
    options.attachApiKey = true;
  }

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (options.attachApiKey) {
    headers.api_key = process.env.VUE_APP_API_KEY;
  }

  return headers;
};
