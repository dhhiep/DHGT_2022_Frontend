import Vue from 'vue';
import VueRouter from 'vue-router';
import Welcome from '../views/Welcome.vue';
import Passphrase from '../views/Passphrase.vue';
import MainScreen from '../views/MainScreen.vue';
import SubScreen from '../views/SubScreen.vue';
import Setting from '../views/Setting.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: Welcome,
  },
  {
    path: '/passphrase',
    name: 'passphrase',
    component: Passphrase,
  },
  {
    path: '/main-screen',
    name: 'main-screen',
    component: MainScreen,
    meta: { authenticate: true },
  },
  {
    path: '/sub-screen',
    name: 'sub-screen',
    component: SubScreen,
    meta: { authenticate: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: Setting,
    meta: { authenticate: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
