<template>
    <th class="ResizeableTH" @click="HandleClick">
        <!-- <slot></slot> -->
        <div class="th-content"><slot></slot></div>
        <div class="resize-trigger-block" 
            :class="ResizeTriggerBlockClass" 
            @mousedown="HandleMouseDown" ></div>
    </th>
</template>

<script>
    import ResizeMixin from './ResizeMixin.js'
    import CellDisplay from '../cell/CellDisplay.vue'

    export default {
        name: "ResizeableTH",
        components:{
            CellDisplay
        },
        mixins:[
            ResizeMixin
        ],
        props:{
            // ResizeDirection from ResizeMixin.js
            rowIndex:{
                type: Number,
            }
        },
        computed:{
            ResizeTriggerBlockClass:{
                get(){
                    switch (this.ResizeDirection) {
                        case "row":
                            return this.resizeTriggerBlockRowClass
                        case "col":
                            return this.resizeTriggerBlockColClass
                        default:
                            return ""
                    }
                }
            }
        },
        methods:{
            HandleMouseDown(){
                // console.log(this)
                // console.log(this.$el)
                // console.log(this.$el.getBoundingClientRect())

                switch (this.ResizeDirection) {
                    case "row":
                        this.$emit(this.startResizeRowEmitName, this.$el)
                    case "col":
                        this.$emit(this.startResizeColEmitName, this.$el)
                    default:
                        return ""
                }
            },
            HandleClick(){
                this.$emit("click", this.rowIndex)
            },
        },
    }
</script>

<style lang="scss" scoped>

    .ResizeableTH{
        position: relative;
        z-index:  98;
    }

    .th-content{
        font-weight: 700;
        font-size: 13.6px;
        // line-height: 40px;
        // line-height: 100%;
    }

    .resize-trigger-block{
        position: absolute;
    }

    .resize-trigger-block:hover{
        background: darkgray;
    }

    $width-trigger-block: 8px;
    .resize-trigger-block-col{
        cursor: col-resize;
        height: 100%;
        width: $width-trigger-block;        
        right: 0;
        top: 0;        
    }

    .resize-trigger-block-row{
        cursor: row-resize;
        height: $width-trigger-block;
        width: 100%;
        left: 0;
        bottom: 0;
    }

</style>
