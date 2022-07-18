import Vue from "vue";
import App from "./App.vue";
import router from "./router/routes";
import vmodal from "vue-js-modal";
import Vuelidate from "vuelidate";
import VueToast from "vue-toast-notification";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/styles/style.css";
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(vmodal);
Vue.use(Vuelidate);
Vue.use(VueToast);
Vue.component('loading', Loading)


new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
