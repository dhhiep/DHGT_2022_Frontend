import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { restoreLocalData } from '@/services/localStorage';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  created() {
    restoreLocalData();
  },
  render: (h) => h(App),
}).$mount('#app');
