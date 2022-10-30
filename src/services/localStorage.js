import store from '@/store/index.js';

const KEYS = {
  FLIPPED_IMAGE: 'localFlippedImageData',
};

//  STORE LOCAL DATA
export const storeLocalFlippedImageData = (flippedImageData) => {
  return setItem(KEYS.FLIPPED_IMAGE, flippedImageData);
};

// LOAD FROM LOCAL DATA
export const loadLocalFlippedImageData = () => {
  return getItem(KEYS.FLIPPED_IMAGE);
};

//  CLEAR LOCAL DATA
export const clearLocalFlippedImageData = () => {
  return removeItem(KEYS.FLIPPED_IMAGE);
};

// OTHER FUNCTIONS
export const restoreLocalData = async () => {
  store.dispatch('flippedImage/setFlippedImageData', loadLocalFlippedImageData(), { root: true });
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
