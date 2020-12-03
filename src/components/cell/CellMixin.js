'use strict'

import CellWrapper from './CellWrapper.vue'

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
        isReadonly:{
            required: true,
            type: Boolean,
            default: () => false,
        },
        formData:{
            required: true,
            type: Array, // Array of Array
        }
    },
    watch:{
        value(new_value){
            this.data = new_value
        }
    },
    data(){
        return {
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
        Enter(){
            this.$nextTick(() => {
                this.$refs.cellWrapper.HandleKeyboardEnter()
            })
        },
    },
}