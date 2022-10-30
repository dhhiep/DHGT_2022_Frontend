import Vue from 'vue';
import Vuex from 'vuex';

import * as auth from '@/store/modules/auth';
import * as welcome from '@/store/modules/welcome';
import * as flippedImage from '@/store/modules/flipped_image';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    welcome,
    flippedImage,
  },
});
