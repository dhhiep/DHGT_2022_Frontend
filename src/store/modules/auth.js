export const namespaced = true;

import md5 from 'md5';
import { storeLocalAuth, loadLocalAuth } from '@/services/localStorage';

export const state = {
  authData: {},
};

export const mutations = {
  SET_AUTH_DATA(state, authData) {
    state.authData = authData;
    storeLocalAuth(authData);
  },
};

export const actions = {
  setAuthData({ commit }, authData) {
    return commit('SET_AUTH_DATA', authData);
  },
  storePassphrase({ state, commit }, passphrase) {
    const authData = {
      ...state.authData,
      passphrase: md5(passphrase),
    };

    return commit('SET_AUTH_DATA', authData);
  },
};

export const getters = {
  isPassphrasePassed(state) {
    const passphrase = state.authData.passphrase || loadLocalAuth().passphrase || '';

    return process.env.VUE_APP_PASSPHRASE_HASH == md5(passphrase);
  },
};
