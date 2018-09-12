import App from './App.vue';
import Home from './Home.vue';
import Users from  './Users.vue';
import Auction from  './Auction.vue';
import Auctions from  './Auctions.vue';
import SellerAuctions from  './SellerAuctions.vue';
import Navbar from './Navbar.vue';

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueRouter from 'vue-router';
Vue.use(VueRouter);
import VueResource from 'vue-resource';
Vue.use(VueResource);
import VueCookie from 'vue-cookie';
Vue.use(VueCookie);

// Vue.http.options.emulateJSON = true;

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/users/:userId",
    name: "user",
    component: Users
  },
  {
    path: '/users',
    name: "users",
    component: Users
  },
  {
    path: '/auctions',
    name: "auctions",
    component: Auctions
  },
  {
    path: '/users/auctions/:sellerId',
    name: "sellerAuctions",
    component: SellerAuctions
  },
  {
    path: '/auctions/:auctionId',
    name: "auction",
    component: Auction
  }

];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});

new Vue({
  el: '#navbar',
  router: router,
  render: h => h(Navbar)
});
