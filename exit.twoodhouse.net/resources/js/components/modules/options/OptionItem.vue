<template>
    <b-card>
        <b-card-title class="mb-0">{{ title }}</b-card-title>
        <small class="text-secondary">{{ description }}</small>
        <slot/>
    </b-card>
</template>

<script>
export default {
    name: 'OptionItem',
    props: {
        title: {
            type: String,
            required: true,
        },
        description: String,
    }
}
</script>