import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueSweetalert2 from 'vue-sweetalert2';

import { restoreLocalData } from '@/services/localStorage';
import { establish_ws_broadcast_channel } from '@/utils/websocket_broadcast';
import { blankFunc } from '@/utils/lang';

import 'sweetalert2/dist/sweetalert2.min.css';
import 'animate.css';

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
  mounted() {
    restoreLocalData();

    establish_ws_broadcast_channel(blankFunc, (data) => {
      const whitelistActions = ['update_config'];
      if (whitelistActions.includes(data.type)) {
        console.log('main#onMessage', data);
        store.dispatch('setting/setSetting', data);
      }
    });
  },
  render: (h) => h(App),
}).$mount('#app');
