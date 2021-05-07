import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import VueJsIntercom from './plugins';
import Index from './views/Index.vue';
import Two from './views/Two.vue';

Vue.use(VueRouter);
Vue.use(VueJsIntercom, {
  app_id: process.env.VUE_APP_INTERCOM_ID,
});

const routes = [
  { path: '/', component: Index },
  { path: '/two', component: Two },
];

const router = new VueRouter({
  routes,
});

Vue.config.productionTip = false;

new Vue({
  render: function (h) {
    return h(App);
  },
  router,
}).$mount('#app');
