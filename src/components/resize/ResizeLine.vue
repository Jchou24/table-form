<template>
    <div class="ResizeLine" :class="resizeClass"></div>
</template>

<script>
    import ResizeMixin from './ResizeMixin.js'

    export default {
        name: "ResizeLine",
        mixins:[ ResizeMixin ],
        props:{
            // ResizeDirection from ResizeMixin.js
        },
        computed:{
            resizeClass:{
                get(){
                    switch (this.ResizeDirection) {
                        case "row":
                            return "ResizeLineRow"
                        case "col":
                            return "ResizeLineCol"                    
                        default:
                            break;
                    }
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .ResizeLine{
        position: absolute;
        z-index:  101;
        background: cornflowerblue;
    }

    .ResizeLineCol{
        top: 0;
        height: 100%;
        width: 5px;
    }

    .ResizeLineRow{
        left: 0;
        height: 5px;
        width: 100%;
    }
</style>
