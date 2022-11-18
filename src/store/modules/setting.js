export const namespaced = true;

import { increaseCounterOnline, resetCounter, updateSettings } from '@/services/backend';
import { loadLocalSetting, storeLocalSetting } from '@/services/localStorage';

const DEFAULT_MAX_COUNTERS = 1000;

export const state = {
  maxCounter: 1000,
  ratio: 10,
};

export const mutations = {
  SET_MAX_COUNTER(state, maxCounter) {
    state.maxCounter = maxCounter || DEFAULT_MAX_COUNTERS;

    storeLocalSetting({
      ...loadLocalSetting(),
      maxCounter,
    });
  },
  SET_RATIO(state, ratio) {
    state.ratio = ratio;

    storeLocalSetting({
      ...loadLocalSetting(),
      ratio,
    });
  },
};

export const actions = {
  setSetting({ commit }, settings) {
    commit('SET_MAX_COUNTER', settings.maxCounter);
    commit('SET_RATIO', settings.ratio);
  },
  increaseCounterOnline() {
    return increaseCounterOnline();
  },
  updateSettings(_, settings) {
    const ratio = settings.maxCounter / 100;

    return updateSettings({ ...settings, ratio });
  },
  resetCounter() {
    return resetCounter();
  },
};

export const getters = {
  maxCounter(state) {
    return Number(state.maxCounter || DEFAULT_MAX_COUNTERS);
  },
  ratio(state) {
    return Number(state.ratio);
  },
};
