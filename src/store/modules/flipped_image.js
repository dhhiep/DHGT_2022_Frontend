export const namespaced = true;

import { storeLocalFlippedImageData, loadLocalFlippedImageData } from '@/services/localStorage';

export const state = {
  flippedImageData: { counter: 0, pieces: 0, ratio: 10 },
};

export const mutations = {
  SET_FLIPPED_IMAGE_DATA(state, flippedImageData) {
    state.flippedImageData = flippedImageData;
    storeLocalFlippedImageData(flippedImageData);
  },
};

export const actions = {
  setFlippedImageData({ commit, rootGetters }, flippedImageData) {
    if (state.flippedImageData.counter && flippedImageData.counter < state.flippedImageData.counter) return;
    if (flippedImageData.counter > rootGetters['setting/maxCounter']) {
      flippedImageData.counter = rootGetters['setting/maxCounter'];
    }

    return commit('SET_FLIPPED_IMAGE_DATA', flippedImageData);
  },
  increaseCounter({ dispatch, state, rootGetters }) {
    const data = {
      ...state.flippedImageData,
      ratio: rootGetters['setting/ratio'] || state.flippedImageData.ratio,
    };

    data.counter = data.counter + 1;
    data.pieces = Math.floor(data.counter / data.ratio);
    console.log('increaseCounter', data);

    return dispatch('setFlippedImageData', data);
  },
  resetFlippedImageData({ commit }) {
    return commit('SET_FLIPPED_IMAGE_DATA', { counter: 0, pieces: 0, ratio: 10 });
  },
  reloadFlippedImageData({ dispatch }) {
    return dispatch('setFlippedImageData', loadLocalFlippedImageData());
  },
};

export const getters = {
  currentCounter(state) {
    return state.flippedImageData.counter;
  },
  currentOpenPieces(state) {
    return state.flippedImageData.pieces;
  },
};
