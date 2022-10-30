import Vue from 'vue';
import Vuex from 'vuex';

import * as welcome from '@/store/modules/welcome';
import * as flippedImage from '@/store/modules/flipped_image';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    welcome,
    flippedImage,
  },
});
