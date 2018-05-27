// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import BootstrapVue from 'bootstrap-vue';
import VueFire from 'vuefire';
import './firebase';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss';
import '../src/css/weather-icons.css';
import '../src/css/weather-icons.min.css';
import '../src/css/weather-icons-wind.css';
import '../src/css/weather-icons-wind.min.css';

const app = new Vue({
  render: h => h(App),
}).$mount('#app');


Vue.use(BootstrapVue);
Vue.use(VueFire);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
});
