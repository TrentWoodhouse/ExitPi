<template>
    <div>
        <b-row class="pb-2">
            <b-col v-for="item in tabList" :key="'button-' + item.key" cols="2">
                <b-button variant="dark" :to="$route.name === item.key ? {name: 'home'} : item.to" :pressed="$route.name === item.key" block>
                    <b-icon :icon="item.icon"/>
                    {{ item.label }}
                </b-button>
            </b-col>
        </b-row>
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'Options',
    data() {
        return {
            tabList: [
                {
                    key: 'text',
                    label: 'Text',
                    icon: 'blockquote-left',
                    to: {name: 'text'},
                },
                {
                    key: 'image',
                    label: 'Image',
                    icon: 'image',
                    to: {name: 'image'},
                },
            ]
        }
    },
}
</script>