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
                this.$emit(ShareVar.addRowEmitName,[{ newIndex: this.data.length - 1 }])
            },
        },
    }
</script>

<style lang="scss" scoped>
    .FormVirtualRow{
        border-style: dotted;
        border-color: #b6b5b5;
        color: grey;
        background: whitesmoke;

        margin: 10px;
        border-radius: 10px;
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
