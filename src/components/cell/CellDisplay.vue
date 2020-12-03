<template>
    <textarea readonly>{{text}}</textarea>
</template>

<script>
    export default {
        name: "CellDisplay",
        props:{
            text:{
                required: true,
            }
        },
    }
</script>

<style lang="scss" scoped>
    textarea{
        position: absolute;
        top:0px;
        left:0px;

        height: inherit;
        width: inherit;

        background: none;
        border: none;
        resize: none;

        padding: 6px 10px;
        font-size: .85rem;
    }

    textarea::selection{
        background: none;
    }
</style>
