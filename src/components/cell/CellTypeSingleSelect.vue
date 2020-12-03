<template>
    <CellWrapper class="CellTypeSingleSelect" :text="name" :isReadonly="isReadonly" @checkCellEditing="HandleCheckCellEditing" ref="cellWrapper">
        <multiselect class="CellTypeSingleSelect-editor"
            v-model="selectorData"
            :options="options"
            label="name"
            :allow-empty="false"
            :searchable="true"
            :show-labels="false"
            :isDisabled="true"
            placeholder="請選擇"
            @input="$emit('input',selectorData.value)"
            @close="HandleClose"

            ref="editor"
        >
            <template slot="noResult">Result: 0</template>        
        </multiselect>
    </CellWrapper>
</template>

<script>
    import Multiselect from 'vue-multiselect';
    import 'vue-multiselect/dist/vue-multiselect.min.css';

    import CellMixin from './CellMixin.js'
    import ShareVar from '../ShareVar.js'

    export default {
        name: "CellTypeSingleSelect",
        components:{
            Multiselect
        },
        mixins:[
            CellMixin
        ],
        props:{
            options: {
                // ex
                // [{value: '1', name: 'A'},
                //  {value: '2', name: 'B'}]
                required: true,
                type: Array,
            },
            value: {
                // override CellMixin.js
                required: true,
                type: ShareVar.valueTypes.singleSelect,
                default: ShareVar.defaultValue.singleSelect,
            },
        },
        data(){
            let mapper = this.InitMapper()
            return {
                mapper,
                data: mapper[this.value],
                selectorData: { name: this.GetName(this.value, mapper), value: this.value }
            }
        },
        computed:{
            name:{
                get(){
                    return this.GetName(this.value)
                }
            },
        },
        methods:{
            InitMapper(){
                let mapper = {}
                this.options.forEach( option => mapper[option.value] = option )
                return mapper
            },
            GetName(key, mapper){
                mapper = this.mapper || mapper
                let mapped = mapper[key]
                let name = mapped ? mapped.name : ""
                return name || ""
            },
            Enter(){
                // override CellMixin.js
                this.$nextTick(() => {
                    this.$refs.cellWrapper.HandleDdubleClick()
                })
            },
            Focus(){
                let that = this
                this.$nextTick(() => {
                    setTimeout(function(){
                        that.$refs.editor.activate()
                    }, 10)                    
                })
            },
            HandleClose(){
                this.$nextTick(() => {
                    this.$refs.cellWrapper.HandleClickaway()
                })
            },
        },
    }
</script>

<style lang="scss">
    .CellTypeSingleSelect{
        .multiselect__option--highlight{
            background: cornflowerblue;
        }
    }
</style>

<style lang="scss" scoped>
    .CellTypeSingleSelect .CellTypeSingleSelect-editor{
        position: absolute;
        top:0px;
        left:0px;
    }
</style>
