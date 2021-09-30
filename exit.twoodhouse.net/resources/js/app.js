require('./bootstrap');

window.Vue = require('vue').default;
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import Vue from 'vue';
import VueSocketIO from 'vue-socket.io'
import { store } from './store';
import { router } from './router';
import config from './config';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(new VueSocketIO({
    connection: `${process.env.MIX_APP_URL}:${config.socket_port}`,
    vuex: {
        store,
        actionPrefix: 'socket_',
        mutationPrefix: 'socket_',
    },
}))

const files = require.context('./', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

const app = new Vue({
    el: '#app',
    store,
    router,
    render: h => h('App'),
});
