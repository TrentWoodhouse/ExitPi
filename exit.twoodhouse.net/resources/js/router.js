import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './components/Home';
import TextOption from './components/modules/options/TextOption';
import ImageOption from './components/modules/options/ImageOption';

Vue.use(VueRouter);

export const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '',
            name: 'home',
            component: Home,
            children: [
                {
                    path: '/text',
                    name: 'text',
                    component: TextOption,
                },
                {
                    path: '/image',
                    name: 'image',
                    component: ImageOption,
                },
            ]
        },
        {
            path: '*',
            redirect: {name: 'home'}
        }
    ]
});