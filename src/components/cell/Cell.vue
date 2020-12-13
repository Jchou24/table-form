<template>
    <td class="Cell" >
        <CellTypeSingleSelect 
            :isReadonly="isReadonly"
            :options="headSettings.options"
            :headSettings="headSettings"
            :formData="formData"
            :rowIndex="rowIndex"
            v-model="data"
            @input="$emit('input',data)"
            @modifyCells="HandleEmitCellModified"
            @checkCellEditing="HandleCheckCellEditing"
            v-if="isShowCellTypeSingleSelect"
            ref="cellHandler"
            />
            <!-- :options="[{value: '1', name: 'A'},{value: '2', name: 'B'}]"  -->

        <CellTypeNumber 
            :isReadonly="isReadonly"
            :options="headSettings.options"
            :headSettings="headSettings"
            :formData="formData"
            :rowIndex="rowIndex"
            v-model="data"
            @input="$emit('input',data)"
            @modifyCells="HandleEmitCellModified"
            @checkCellEditing="HandleCheckCellEditing"
            v-if="isShowCellTypeNumber"
            ref="cellHandler"
            />

        <CellTypeTextArea
            :isReadonly="isReadonly"
            :options="headSettings.options"
            :headSettings="headSettings"
            :formData="formData"
            :rowIndex="rowIndex"
            v-model="data"
            @input="$emit('input',data)"
            @modifyCells="HandleEmitCellModified"
            @checkCellEditing="HandleCheckCellEditing"
            v-if="isShowCellTypeTextArea"
            ref="cellHandler"
            />
    </td>
</template>

<script>
    import CellTypeSingleSelect from './CellTypeSingleSelect.vue'
    import CellTypeNumber from './CellTypeNumber.vue'
    import CellTypeTextArea from './CellTypeTextArea.vue'

    import ShareVar from '../ShareVar.js'

    export default {
        name: "Cell",
        components:{
            CellTypeSingleSelect,
            CellTypeNumber,
            CellTypeTextArea,
        },
        props:{
            value: {
                required: true,
            },
            headSettings:{
                required: true,
                type: Object,
                // title: "Learning Time",
                // relatedKey: "learningTime",
                // cellType: FormSettings.cellTypes.number,
                // style:{},
                // options:{}
            },
            isReadonly:{
                required: true,
                type: Boolean,
                default: () => false,
            },
            cellType:{
                required: true,
                type: String,
                validator: function (value) {
                    // The value must match one of cellTypes
                    return Object.values(ShareVar.cellTypes).indexOf(value) !== -1
                }
            },
            rowIndex:{
                required: true,
                type: Number,
            },
            formData:{
                required: true,
                type: Array, // Array of Object
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
        computed:{
            isShowCellTypeSingleSelect:{ 
                get(){ 
                    return this.cellType == ShareVar.cellTypes.singleSelect 
                }
            },
            isShowCellTypeNumber:{ 
                get(){ 
                    return this.cellType == ShareVar.cellTypes.number 
                }
            },
            isShowCellTypeTextArea:{ 
                get(){ 
                    return this.cellType == ShareVar.cellTypes.textarea 
                }
            },
        },
        methods:{
            HandleCheckCellEditing(isCellEditing){
                this.$emit("checkCellEditing", isCellEditing)
            },
            HandleEmitCellModified(event){
                this.$emit( ShareVar.cellModifiedEmitName, event )
                // console.log( "Cell Emit Event", ShareVar.cellModifiedEmitName, event )
            },
            Enter(){
                this.$nextTick( () => {
                    // console.log( this.$refs.cellHandler )
                    this.$refs.cellHandler.Enter()
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .Cell{
        position: relative;
        background: white;
    }
</style>
