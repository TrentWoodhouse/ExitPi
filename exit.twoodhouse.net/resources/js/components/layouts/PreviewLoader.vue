<template>
    <span v-if="loading" class="mx-2">
        <b-spinner small/>
        {{ text }}
    </span>
</template>

<script>
    export default {
        name: 'PreviewLoader',
        data() {
            return {
                increment: 0,
                interval: null
            }
        },
        computed: {
            text() {
                let text = 'Loading Preview';
                for(let i = 0; i < this.increment; i++) {
                    text += '.';
                }
                return text;
            },
            loading() {
                return this.$store.state.loadingPreview;
            }
        },
        created() {
            if(this.loading) this.makeInterval();
        },
        watch: {
            loading(newVal) {
                if(newVal) {
                    this.makeInterval();
                }
                else {
                    clearInterval(this.interval);
                }
            }
        },
        destroyed() {
            clearInterval(this.interval);
        },
        methods: {
            makeInterval() {
                this.interval = setInterval(() => {
                    this.increment = (this.increment + 1) % 4;
                }, 600);
            }
        }
    }
</script>