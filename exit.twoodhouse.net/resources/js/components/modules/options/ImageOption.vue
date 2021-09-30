<template>
    <option-item title="Image" description="Uploade an image (including gifs) to be displayed">
        <b-row>
            <b-col cols="6">
                <b-form-group>
                    <b-form-file accept="image/*" placeholder="Choose a file or drop it here"/>
                </b-form-group>
            </b-col>
        </b-row>
        <b-button variant="dark">Display</b-button>
    </option-item>
</template>

<script>
import OptionItem from './OptionItem.vue';
export default {
    name: 'ImageOption',
    components: { OptionItem },
    data() {
        return {
            form: {},
        }
    },
}
</script>