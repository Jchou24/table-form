<template>
    <div class="CellWrapper" v-on-clickaway="HandleClickaway" @dblclick="HandleDdubleClick">
        <CellDisplay :text="text" v-if="isDisplayValueOnly"/>
        <slot v-else></slot>
    </div>
</template>

<script>
    import { directive as onClickaway } from 'vue-clickaway';

    import CellDisplay from './CellDisplay.vue'

    export default {
        name: "CellWrapper",
        directives: {
            onClickaway: onClickaway,
        },
        components:{
            CellDisplay
        },
        props:{
            text:{
                required: true,
            },
            isReadonly:{
                required: true,
                type: Boolean,
                default: () => false,
            },
        },
        data(){
            return {
                isDisplayDataMode: true
            }
        },
        watch:{
            isDisplayValueOnly(newValue){
                this.$emit('checkCellEditing', !newValue)
            }
        },
        computed:{
            isDisplayValueOnly:{
                get(){
                    return this.isReadonly || this.isDisplayDataMode
                }
            }
        },
        methods:{
            HandleClickaway(){
                return this.isDisplayDataMode = true
            },
            HandleDdubleClick(){
                return this.isDisplayDataMode = false
            },
            HandleKeyboardEnter(){
                this.isDisplayDataMode = !this.isDisplayDataMode
            },
        },
    }
</script>

<style lang="scss" >
    .CellWrapper{
        height: 100%;
        width: 100%;
    }
</style>
