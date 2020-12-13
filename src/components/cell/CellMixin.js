'use strict'

import CellWrapper from './CellWrapper.vue'
import ShareVar from '../ShareVar.js'

export default {
    components:{
        CellWrapper
    },
    props:{
        value: {
            required: true,
            type: Array,
        },
        // error: {
        //     required: true,
        //     type: Array
        // },
        // is_note: {
        //     required: true,
        //     type: Boolean,
        // }
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
        formData:{
            required: true,
            type: Array, // Array of Object
        },
        rowIndex:{
            required: true,
            type: Number,
        },
    },
    watch:{
        value(new_value){
            this.data = new_value
        },
    },
    data(){
        return {
            oldValue: JSON.parse(JSON.stringify(this.value)),
            data: this.value,
        }
    },
    methods:{
        HandleCheckCellEditing(isCellEditing){
            this.$emit("checkCellEditing", isCellEditing)
            this.$nextTick(() => {
                if (isCellEditing) {
                    this.Focus() // Focus() must be defined by each cellType
                }
            })
        },
        HandleEmitCellModified(){
            if( JSON.stringify(this.oldValue) == JSON.stringify(this.data) ){
                return
            }

            this.$emit( ShareVar.cellModifiedEmitName, [{
                rowIndex: this.rowIndex,
                relatedKey: this.headSettings.relatedKey,
                oldValue: JSON.parse(JSON.stringify(this.oldValue)),
                newValue: JSON.parse(JSON.stringify(this.data)),
            }])
        },
        Enter(){
            this.$nextTick(() => {
                this.$refs.cellWrapper.HandleKeyboardEnter()
            })
        },
    },
}