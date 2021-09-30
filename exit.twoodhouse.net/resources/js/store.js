import Vue from 'vue';
import Vuex from 'vuex';
import config from './config';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        rows: config.rows,
        cols: config.cols,
        animation: null,
        preview: null,
        loadingPreview: false,
    },
    getters: {

    },
    mutations: {
        setDimensions(state, {rows, cols}) {
            state.rows = parseInt(rows);
            state.cols = parseInt(cols);
        },
        setAnimation(state, animation) {
            state.animation = animation;
        },
        setPreview(state, preview) {
            state.preview = preview;
        },
        socket_set_animation(state, animation) {
            state.animation = animation;
        },
        socket_set_preview(state, preview) {
            state.preview = preview;
            state.loadingPreview = false;
        },
        socket_set_state(state, {rows, cols}) {
            state.rows = rows;
            state.cols = cols;
        },
        loadPreview(state) {
            state.loadingPreview = true;
        }
    },
});