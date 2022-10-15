import Vue from 'vue';
import Vuex from 'vuex';

import * as welcome from '@/store/modules/welcome.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    welcome,
  },
});
