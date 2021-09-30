<template>
    <div>
        <display/>
        <options/>
    </div>
</template>

<script>
import Display from './modules/Display.vue';
import Options from './modules/Options.vue';
export default {
    name: "Home",
    components: {
        Display,
        Options,
    },
}
</script>

<style scoped>
    .card {
        padding: 30px;
    }
</style>