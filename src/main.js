import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueSweetalert2 from 'vue-sweetalert2';

import { restoreLocalData } from '@/services/localStorage';

import 'sweetalert2/dist/sweetalert2.min.css';

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.meta.authenticate && !store.getters['auth/isPassphrasePassed']) {
    router.push({ name: 'passphrase' });
  }

  next();
});

Vue.use(VueSweetalert2);

new Vue({
  router,
  store,
  created() {
    restoreLocalData();
  },
  render: (h) => h(App),
}).$mount('#app');
