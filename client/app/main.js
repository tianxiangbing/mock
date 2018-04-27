///txb 
import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import router from './router/routes';
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
