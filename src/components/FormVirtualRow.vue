<template>
    <div class="FormVirtualRow" 
        @input="$emit('input',data)"
        @click="HandleClick"
        >
        <i class="material-icons">add</i>
    </div>
</template>

<script>
    import ShareVar from './ShareVar.js'

    export default {
        name: "FormVirtualRow",
        props:{
            value: {
                required: true,
                type: Array,
            },
            options:{
                required: true,
                type: Object
            }
        },
        data(){
            return {
                data: this.value,
            }
        },
        watch:{
            value(new_value){
                this.data = new_value
            }
        },
        methods:{
            HandleClick(){
                let tmpRowArray = ShareVar.GetDefaultRow(this.options)
                this.data.push(tmpRowArray)
                this.$emit('input', this.data)
            },
        },
    }
</script>

<style lang="scss" scoped>
    .FormVirtualRow{
        border-style: dotted;
        border-color: grey;
        color: grey;
        background: whitesmoke;

        margin: 3px;
        height: 40px;
        cursor: pointer;
        display: flex;
        justify-content: center;

        .material-icons{
            margin-top: 5px;
        }
    }

    .FormVirtualRow *::selection{
        background: unset;
    }
</style>
