import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/home/Index.vue';

Vue.use(VueRouter);
const router = new VueRouter({
    // mode: 'history',
    base: __dirname,
    routes: [
      { path: '/', component: Home },
      { path: '/home', component: Home }//,
    //   // Just use them normally in the route config
    //   { path: '/foo', component: Foo },
    //   // Bar and Baz belong to the same root route
    //   // and grouped in the same async chunk.
    //   { path: '/bar', component: Bar,
    //     children: [
    //       { path: 'baz', component: Baz }
    //     ]
    //   }
    ]
  })
  export default router;