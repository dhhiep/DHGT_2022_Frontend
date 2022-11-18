import store from '@/store/index.js';

const KEYS = {
  AUTH: 'localAuth',
  ASSET: 'localAsset',
  FLIPPED_IMAGE: 'localFlippedImageData',
  SETTING: 'localSetting',
};

//  STORE LOCAL DATA
export const storeLocalAuth = (authData) => {
  return setItem(KEYS.AUTH, authData);
};
export const storeLocalAsset = (assetData) => {
  return setItem(KEYS.ASSET, assetData);
};
export const storeLocalSetting = (settingData) => {
  return setItem(KEYS.SETTING, settingData);
};
export const storeLocalFlippedImageData = (flippedImageData) => {
  return setItem(KEYS.FLIPPED_IMAGE, flippedImageData);
};

// LOAD FROM LOCAL DATA
export const loadLocalAuth = () => {
  return getItem(KEYS.AUTH);
};
export const loadLocalAsset = () => {
  return getItem(KEYS.ASSET);
};
export const loadLocalSetting = () => {
  return getItem(KEYS.SETTING);
};
export const loadLocalFlippedImageData = () => {
  return getItem(KEYS.FLIPPED_IMAGE);
};

//  CLEAR LOCAL DATA
export const clearLocalFlippedImageData = () => {
  return removeItem(KEYS.FLIPPED_IMAGE);
};
export const clearLocalAsset = () => {
  return removeItem(KEYS.ASSET);
};

// OTHER FUNCTIONS
export const restoreLocalData = async () => {
  store.dispatch('auth/setAuthData', loadLocalAuth(), { root: true });
  store.dispatch('flippedImage/setFlippedImageData', loadLocalFlippedImageData(), { root: true });
  store.dispatch('setting/setSetting', loadLocalSetting(), { root: true });
};

// PRIVATE
const getItem = (key) => {
  try {
    let dataString = localStorage.getItem(key);

    return JSON.parse(dataString) || {};
  } catch {
    return {};
  }
};

const setItem = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const removeItem = (key) => {
  localStorage.removeItem(key);
};
