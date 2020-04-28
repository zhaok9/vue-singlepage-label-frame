import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import ElementUI from "element-ui";
import Components from './components';
import { store } from './store';
import './service';
import './api';

// import IScroll from 'iscroll/build/iscroll'; // 普通版
// import IScroll from 'iscroll/build/iscroll-probe'; // 复杂版
// import IScroll from 'iscroll/build/iscroll-infinite'; // 无限循环版

import './assets/scss/style.css';

// Vue.config.devtools = true;
Vue.config.productionTip = false;

Vue.use( ElementUI);

for( let key in Components ){
    Vue.use( Components[ key ] );
}

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')