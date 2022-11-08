export const namespaced = true;

import { isVideoPath } from '@/utils/file_extension';
import { randomAssetURL } from '@/utils/assets';
import { storeLocalAsset } from '@/services/localStorage';
import * as AssetService from '@/services/asset';

export const state = {
  currentAsset: '',
  currentPoster: '',
};

export const mutations = {
  SET_ASSET(state, asset) {
    storeLocalAsset(asset);
    state.currentAsset = asset;
  },
  SET_POSTER(state, poster) {
    state.currentPoster = poster;
  },
};

export const actions = {
  setAssets({ commit }, assets) {
    commit('SET_ASSETS', assets);
  },
  setAsset({ commit }, asset) {
    commit('SET_ASSET', asset);
  },
  setPoster({ commit }, poster) {
    commit('SET_POSTER', poster);
  },
  fetchAsset({ dispatch }) {
    return AssetService.fetch().then((asset) => {
      if (isVideoPath(asset)) {
        dispatch('fetchVideoPoster');
      }

      dispatch('setAsset', asset);
    });
  },
  fetchVideoPoster({ dispatch, getters }) {
    dispatch('setPoster', getters.fetchVideoPoster);
  },
};

export const getters = {
  fetchVideoPoster(state) {
    const pathName = `${process.env.VUE_APP_NAME}-posters/`;
    const posters = state.assets.filter((assetPath) => assetPath.includes(pathName));

    return randomAssetURL(posters);
  },
  fetchAsset(state) {
    const pathName = `${process.env.VUE_APP_NAME}/`;
    const posters = state.assets.filter((assetPath) => assetPath.includes(pathName));

    return randomAssetURL(posters);
  },
};
