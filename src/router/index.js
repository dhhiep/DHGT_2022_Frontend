import Vue from 'vue';
import VueRouter from 'vue-router';
import Welcome from '../views/Welcome.vue';
import MainScreen from '../views/MainScreen.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/main-screen',
    name: 'MainScreen',
    component: MainScreen,
  },
  {
    path: '/',
    name: 'Welcome',
    component: Welcome,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
