<template>
    <td class="Cell" >
        <CellTypeSingleSelect 
            :isReadonly="isReadonly"
            :options="options"
            :formData="formData"
            v-model="data"
            @input="$emit('input',data)"
            @checkCellEditing="HandleCheckCellEditing"
            v-if="isShowCellTypeSingleSelect"
            ref="cellHandler"
            />
            <!-- :options="[{value: '1', name: 'A'},{value: '2', name: 'B'}]"  -->

        <CellTypeNumber 
            :isReadonly="isReadonly"
            :options="options"
            :formData="formData"
            v-model="data"
            @input="$emit('input',data)"
            @checkCellEditing="HandleCheckCellEditing"
            v-if="isShowCellTypeNumber"
            ref="cellHandler"
            />

        <CellTypeTextArea
            :isReadonly="isReadonly"
            :options="options"
            :formData="formData"
            v-model="data"
            @input="$emit('input',data)"
            @checkCellEditing="HandleCheckCellEditing"
            v-if="isShowCellTypeTextArea"
            ref="cellHandler"

            :rowIndex="rowIndex"
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
            options:{

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
                type: Array, // Array of Array
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
