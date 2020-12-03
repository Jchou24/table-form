<template>
    <vue-context class="ContextMenu" ref="menu">
        <li>
            <a @click="copySelectedCells">
            Copy
            </a>
        </li>
        <!-- 
            can not trigger paste event in js
            <li>
            <a @click="$emit('pasteSelectedCells', $event)">
            Paste
            </a>
        </li> 
        -->
        <li v-if="!isReadonly">
            <a @click="removeRow">
            Remove row
            </a>
        </li>
    </vue-context>
</template>

<script>
    import { VueContext } from 'vue-context'

    export default {
        name: "ContextMenu",
        components:{
            VueContext
        },
        props:{
            isReadonly:{
                required: false,
                type: Boolean,
                default: () => false,
            },  
        },
        methods:{
            open(event){
                this.$refs.menu.open(event)
            },
            copySelectedCells(event){
                this.$emit('copySelectedCells', event)
            },
            removeRow(event){
                this.$emit('removeRows', event)
            }
        },
    }
</script>

<style lang="scss">
    @import '~vue-context/src/sass/vue-context';
</style>

<style lang="scss" scoped>
    .ContextMenu{
        li{
            cursor: pointer;
        }
    }
</style>
