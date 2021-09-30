<template>
    <option-item title="Text" description="Enter text to scroll across the screen">
        <b-row>
            <b-col cols="9">
                <b-form-group>
                    <b-textarea v-model.trim="form.text" rows="3" placeholder="Your text here" debounce="500"/>
                </b-form-group>
                <b-row>
                    <b-col cols="3">
                        <b-form-group label="Speed (pixels per second)">
                            <b-form-input v-model="debounceSpeed" id="speed" type="number" placeholder="(default 20)" min="1"/>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-col>
            <b-col cols="3">
                <chrome-picker v-model="debounceColor"/>
            </b-col>
        </b-row>
        <b-button @click="submit" variant="dark">Display</b-button>
        <preview-loader/>
    </option-item>
</template>

<script>
import OptionItem from './OptionItem.vue';
import { Chrome as ChromePicker } from 'vue-color';
import debounce from '../../../helpers/debounce';
import PreviewLoader from '../../layouts/PreviewLoader.vue';

function initialForm() {
    return {
        text: '',
        color: '#ffffff',
        speed: '20',
    }
}

export default {
    components: { OptionItem, ChromePicker, PreviewLoader },
    name: 'TextOption',
    data() {
        return {
            form: initialForm(),
            debounceColor: initialForm().color,
            debounceSpeed: initialForm().speed,
            loadingPreview: false,
        }
    },
    watch: {
        form: {
            handler() {
                if(this.form.text) {
                    this.$socket.emit('preview_text', this.form);
                    this.$store.commit('loadPreview');
                }
                else {
                    this.$store.commit('setPreview', null);
                }
            },
            deep: true,
        },
        debounceColor: debounce(function(newVal) {
            this.form.color = newVal;
        }, 500),
        debounceSpeed: debounce(function(newVal) {
            this.form.speed = newVal;
        }, 1000),
    },
    methods: {
        submit() {
            if(this.form.text) {
                this.$socket.emit('post_text', this.form);
                this.form = initialForm();
            }
        }
    }
}
</script>