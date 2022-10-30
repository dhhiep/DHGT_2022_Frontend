export const namespaced = true;

import { increaseCounterOnline, resetCounter } from '@/services/backend';

export const state = {};

export const mutations = {};

export const actions = {
  increaseCounterOnline() {
    return increaseCounterOnline();
  },
  resetCounter() {
    return resetCounter();
  },
};

export const getters = {};
