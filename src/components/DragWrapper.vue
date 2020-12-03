<template>
    <draggable class="draggable list-group" 
        v-model="data" 
        v-bind="dragOptions"
        handle=".draggable-th"
        :disabled="isReadonly"
        @start="dragStart"
        @end="dragEnd"
        @update="$emit('input',data)"
        @unchoose="$emit('input',data)"
        >
        <transition-group class="draggable" type="transition" :name="!drag ? 'flip-list' : null">
            <slot></slot>
            <tr class="list-group-item tmp-tr" 
                v-if="data.length==0 && isShowTmpTR" key="tmp-tr"></tr>
        </transition-group>
    </draggable>
</template>

<script> 
    import draggable from 'vuedraggable'

    export default {
        name: "DragWrapper",
        components:{
            draggable,
        },
        props:{
            value: {
                required: true,
                type: Array,
            },
            isShowTmpTR:{
                type: Boolean,
                default: () => false
            },
            isReadonly:{
                required: false,
                type: Boolean,
                default: () => false,
            },  
        },
        data(){
            return {
                data: this.value,
                drag: false,
            }
        },
        watch:{
            value(newValue){
                this.data = newValue
            },
            data(){
                this.$emit('input',this.data)
            }
        },
        computed:{
            dragOptions() {
                return {
                    animation: 200,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost"
                };
            }
        },
        methods:{
            dragStart(){
                this.drag = true
            },
            dragEnd(){
                this.drag = false
                this.$emit('input',this.data)
            }
        },
    }
</script>

<style lang="scss">
    table.form-table .draggable{
        display: contents;
    }

    table.form-table .draggable .tmp-tr{
        min-height: 20px;
        display: block;
    }

    table.form-table{
        .flip-list-move {
            transition: transform 0.5s;
        }
        .no-move {
            transition: transform 0s;
        }
        .ghost {
            opacity: 0.5;
            background: #c8ebfb;
        }
        .list-group {
            min-height: 20px;
        }
        .list-group-item {
            cursor: move;

            &.drag-disabled{
                cursor: auto;
            }
        }
        .list-group-item i {
            cursor: pointer;
        }
    }
</style>
