<template>
    <div :class="{ 'cursor-col-resize':isShowResizeLineCol }" >
        <slot 
            :HandleStartResizeCol="HandleStartResizeCol" 
            :HandleResizeColMove="HandleResizeColMove" 
            :HandleStartResizeRow="HandleStartResizeRow" 
            :HandleResizeRowMove="HandleResizeRowMove" 
        ></slot>

        <FormLighter v-if="isShowResizeLineCol || isShowResizeLineRow" />
        <ResizeLine ResizeDirection="col" v-show="isShowResizeLineCol" ref="ResizeLineCol" />
        <ResizeLine ResizeDirection="row" v-show="isShowResizeLineRow" ref="ResizeLineRow" />
    </div>
</template>

<script>
    import ResizeLine from './ResizeLine.vue'
    import FormLighter from './FormLighter.vue'

    import $ from 'jquery'
    import ShareVar from '../ShareVar.js'

    export default {
        name: "ResizeCellWrapper",
        components:{
            ResizeLine,
            FormLighter,
        },
        data(){
            return {
                ...ShareVar,

                isShowResizeLineCol: false,
                isShowResizeLineRow: false,
                currentResizeElement: null,
            }
        },
        methods:{
            // ================================================
            // Handle Col
            HandleStartResizeCol(el){
                this.currentResizeElement = el
                this.isShowResizeLineCol = true
            },
            HandleResizeColMove(event){
                if (this.$refs.ResizeLineCol && this.$refs.ResizeLineCol.$el && this.$el) {
                    this.$refs.ResizeLineCol.$el.style.left = `${event.clientX - this.$el.getBoundingClientRect().left }px` 
                }
            },
            // ================================================
            // Handle Row
            HandleStartResizeRow(el){
                this.currentResizeElement = el
                this.isShowResizeLineRow = true
            },
            HandleResizeRowMove(event){
                if (this.$refs.ResizeLineRow && this.$refs.ResizeLineRow.$el && this.$el) {
                    this.$refs.ResizeLineRow.$el.style.top = `${event.clientY - this.$el.getBoundingClientRect().top }px` 
                }
            },
            // ================================================
            HandleMouseUp(event){
                // ================================================
                // Handle Col
                if (this.isShowResizeLineCol) {
                    let originalRight = this.currentResizeElement.getBoundingClientRect().right
                    let newRight = event.clientX
                    let modifiedDistance = newRight - originalRight
                    let finalWidth = this.currentResizeElement.getBoundingClientRect().width + modifiedDistance
                    this.currentResizeElement.style.width = `${finalWidth}px`
                    this.currentResizeElement.style.minWidth = `${finalWidth}px`
                }
                // ================================================
                // Handle Row
                if (this.isShowResizeLineRow) {
                    let originalBottom = this.currentResizeElement.getBoundingClientRect().bottom
                    let newBottom = event.clientY
                    let modifiedDistance = newBottom - originalBottom
                    let finalHeight = this.currentResizeElement.getBoundingClientRect().height + modifiedDistance
                    this.currentResizeElement.style.height = `${finalHeight}px`
                }
                // ================================================

                this.isShowResizeLineCol = false
                this.isShowResizeLineRow = false
                this.currentResizeElement = null
            },
            HandleMouseMove(event){
                // console.log("move", event)
                this.HandleResizeColMove(event)
                this.HandleResizeRowMove(event)
                
            },
        },
        mounted(){
            $(window).on("mousemove", this.HandleMouseMove)
            $(window).on("mouseup", this.HandleMouseUp)
        }
    }
</script>

<style lang="scss" scoped>
    .cursor-col-resize{
        cursor: col-resize;
    }

    .cursor-row-resize{
        cursor: row-resize;
    }
</style>
