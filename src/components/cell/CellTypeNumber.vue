<template>
    <CellWrapper class="CellTypeNumber" :text="data" :isReadonly="isReadonly" @checkCellEditing="HandleCheckCellEditing" ref="cellWrapper">
            <vs-input-number class="CellTypeNumber-editor"
                v-model="data" 
                :step="step" 
                :min="options.min" 
                :max="options.max"  
                icon-inc="expand_less" 
                icon-dec="expand_more"         
                @input="HandleEmitInput"
                tabindex="-1"

                ref="editor"
            />
    </CellWrapper>
</template>

<script>
    import Vue from 'vue'
    import $ from 'jquery'
    import { vsInputNumber, vsIcon } from 'vuesax'
    import 'vuesax/dist/vuesax.css'
    import 'material-icons/iconfont/material-icons.css';

    import CellMixin from './CellMixin.js'
    import ShareVar from '../ShareVar.js'

    Vue.use(vsIcon)
    Vue.use(vsInputNumber)

    export default {
        name: "CellTypeNumber",
        mixins:[
            CellMixin
        ],
        props:{
            value: {
                // override CellMixin.js
                required: true,
                type: ShareVar.valueTypes.number,
                default: ShareVar.defaultValue.number,
            },
            options: {
                // ex
                // { step: Float, min: Float, max: Float }
                required: true,
                type: Object,
            },
        },
        watch:{
            data(newValue, oldValue){
                if( newValue != oldValue ){
                    this.oldValue = newValue
                }                
            },
        },
        computed:{
            step:{
                get(){
                    return this.options.step || 0.5
                }
            },
        },
        methods:{
            Focus(){
                $(this.$refs.editor.$el).find("input").focus()
            },
            HandleCheckCellEditing(isCellEditing){
                CellMixin.methods.HandleCheckCellEditing.call(this, isCellEditing)

                this.$nextTick(() => {
                    if (isCellEditing) {       
                        $(this.$refs.editor.$el).find("input").attr('step', this.step);
                    }
                })
            },
            HandleEmitInput(aaa){
                this.data = parseFloat(this.data)
                if (this.options.min && this.data < this.options.min){
                    this.data = this.options.min
                }

                if (this.options.max && this.data > this.options.max){
                    this.data = this.options.max
                }

                this.$emit('input',this.data)
                this.HandleEmitCellModified()
            },
        },
    }
</script>

<style lang="scss">
    .CellTypeNumber{
        .vs-input-number{
            background: white;
        }

        .vs-input-number button{
            background: cornflowerblue;
        }

        .vs-input-number .vs-input-number--input{
            min-width: 30px;
        }
    }
</style>

<style lang="scss" scoped>
    .CellTypeNumber .CellTypeNumber-editor{
        position: absolute;
        top:0px;
        left:0px;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
</style>
