<template>
    <div class="TableForm">
        <table 
            class="form-table"
            :class="tableClass"

            v-on-clickaway="HandleTableClickAway"

            @focus="HandleTableFocus"
            @keydown.up.exact.self.prevent="HandleKeyboardArrow('up')"
            @keydown.down.exact.self.prevent="HandleKeyboardArrow('down')"
            @keydown.left.exact.self.prevent="HandleKeyboardArrow('left')"
            @keydown.right.exact.self.prevent="HandleKeyboardArrow('right')"
            @keydown.shift.up.exact.self.prevent="HandleKeyboardShiftArrow('up')"
            @keydown.shift.down.exact.self.prevent="HandleKeyboardShiftArrow('down')"
            @keydown.shift.left.exact.self.prevent="HandleKeyboardShiftArrow('left')"
            @keydown.shift.right.exact.self.prevent="HandleKeyboardShiftArrow('right')"
            @keydown.enter.exact="HandleKeyboardEnter"

            @keyup.ctrl.67.exact="HandleCopy"
            @keyup.ctrl.86.exact="HandlePaste"
            @keyup.46.exact="HandleSetCellDefault"
            @keyup.shift.46.exact="HandleDeleteSelectedRow"

            @mouseleave="HandleCellMouseLeave()"
            @contextmenu.prevent="HandleContextMenu"

            tabindex="-1"
            ref="table"
            >
            <ResizeCellWrapper>
                <template slot-scope="resizeCellScope">
                    <thead>
                        <tr>
                            <!-- <ResizeableTH :style="defaultColStyle" resize-direction="col" @StartResizeCol="resizeCellScope.HandleStartResizeCol" >編號</ResizeableTH>
                            <ResizeableTH :style="defaultColStyle" resize-direction="col" @StartResizeCol="resizeCellScope.HandleStartResizeCol" >時數</ResizeableTH>
                            <ResizeableTH :style="defaultColStyle" resize-direction="col" @StartResizeCol="resizeCellScope.HandleStartResizeCol" >業務類型</ResizeableTH>
                            <ResizeableTH :style="defaultColStyle" resize-direction="col" @StartResizeCol="resizeCellScope.HandleStartResizeCol" >備註</ResizeableTH> -->

                            <ResizeableTH 
                                :style="defaultCountStyle" 
                                resize-direction="col"
                                @startResizeCol="resizeCellScope.HandleStartResizeCol"
                                @mouseup.native="StopMouseSelecting"
                                >編號</ResizeableTH>
                            <ResizeableTH v-for="(head, index) in options.head" 
                                v-bind:index="index"
                                v-bind:key="index"
                                :style="GetColStyle(head.style)"
                                :options="head.option"
                                resize-direction="col" 
                                @startResizeCol="resizeCellScope.HandleStartResizeCol"
                                @mouseup.native="StopMouseSelecting"
                                >{{head.title}}</ResizeableTH>                           
                        </tr>
                    </thead>
                    <tbody>
                        <!-- <tr>
                            <ResizeableTH :style="defaultRowStyle" resize-direction="row" @StartResizeRow="resizeCellScope.HandleStartResizeRow" >1</ResizeableTH>
                            <Cell v-model="tmp" cellType="number"/>
                            <Cell v-model="tmp2" cellType="singleSelect"/>
                            <Cell v-model="tmp3" cellType="textarea"/>
                        </tr>

                        <tr>
                            <ResizeableTH resize-direction="row" @StartResizeRow="resizeCellScope.HandleStartResizeRow" >2</ResizeableTH>
                            <td>0.0</td>
                            <td>B</td>
                            <td>AAAAAA</td>
                        </tr> -->

                        <DragWrapper 
                            v-model="data"
                            :isShowTmpTR="isShowTmpTR" 
                            :isReadonly="isReadonly"
                            @input="$emit('input',data)" 
                            @addRows="EmitEvent('addRowEmitName', $event)"
                            @removeRows="EmitEvent('removeRowsEmitName', $event)"
                            @moveRows="EmitEvent('moveRowEmitName', $event)"
                            v-if="data.length > 0"
                            >
                            <tr class="list-group-item"
                                :class="{'drag-disabled': isReadonly}"
                                v-for="(rowObject, rowIndex) in data"
                                v-bind:index="rowIndex"
                                v-bind:key="rowIndex"
                                >
                                <ResizeableTH 
                                    class="draggable-th"
                                    resize-direction="row" 
                                    :style="GetRowStyle({})" 
                                    :rowIndex="rowIndex" 
                                    @startResizeRow="resizeCellScope.HandleStartResizeRow" 
                                    @click="HandleSelectRow(rowIndex)"
                                    @mouseup.native="StopMouseSelecting"
                                    >{{rowIndex + 1}}</ResizeableTH>
                                <Cell
                                    v-for="(headOptions, colIndex) in options.head"
                                    v-bind:index="colIndex"
                                    v-bind:key="colIndex"
                                    v-model="data[rowIndex][headOptions.relatedKey]"
                                    :class="GetCellClass(rowIndex, colIndex)"
                                    :headSettings="options.head[colIndex]"
                                    :isReadonly="isReadonly"
                                    :cellType="options.head[colIndex].cellType"
                                    :rowIndex="rowIndex"
                                    :formData="data"

                                    @input="$emit('input',data)"
                                    @modifyCells="EmitEvent('cellModifiedEmitName', $event)"
                                    @checkCellEditing="HandleCheckCellEditing"

                                    @mousedown.left.native.exact="HandleCellMouseDown(rowIndex, colIndex)"
                                    @mouseup.left.native.exact="HandleCellMouseUp(rowIndex, colIndex)"
                                    @mousemove.left.native.exact="HandleCellMouseMove(rowIndex, colIndex)"
                                    @click.shift.left.native.exact="HandleSelectRangedCell(rowIndex, colIndex)"

                                    :ref='GetCellRefName(rowIndex,colIndex)'
                                    />
                            </tr>
                        </DragWrapper>
                        <tr v-else>
                            <ResizeableTH 
                                class="draggable-th"
                                resize-direction="row" 
                                :style="GetRowStyle({})" 
                                :rowIndex="0"
                                @startResizeRow="resizeCellScope.HandleStartResizeRow" 
                                @click="HandleSelectRow(0)"
                                @mouseup.native="StopMouseSelecting"
                                >1</ResizeableTH>
                            <td class="default-row-td" v-for=" ( option, idx ) in options.head" 
                                :key="idx" 
                                @click="HandleDefaultRowTdClick">
                            </td>
                        </tr>
                    </tbody>
                    <transition
                        enter-active-class="animated fadeInDown faster"
                        leave-active-class="animated fadeOutUp faster"
                        >
                        <FormVirtualRow v-model="data" :options="options" 
                            @mouseup.native="StopMouseSelecting"
                            @dragenter.native="isShowTmpTR=true" 
                            @dragleave.native="isShowTmpTR=false"
                            @addRows="EmitEvent('addRowEmitName', $event)"
                            v-if="isTableFocus && !isReadonly"
                            />
                    </transition>
                </template>
            </ResizeCellWrapper>
        </table>

        <ContextMenu :isReadonly="isReadonly"
            @copySelectedCells="HandleCopy"
            @removeRows="HandleDeleteSelectedRow"
            ref="menu" />
        
    </div>
</template>

<script>
    import { directive as onClickaway } from 'vue-clickaway'
    import 'animate.css/animate.min.css'

    import ContextMenu from './ContextMenu.vue'
    import FormVirtualRow from './FormVirtualRow.vue'
    import ResizeableTH from './resize/ResizeableTH.vue'
    import ResizeCellWrapper from './resize/ResizeCellWrapper.vue'
    import DragWrapper from './DragWrapper.vue'
    import Cell from './cell/Cell.vue'
    
    import SelectionMixin from './SelectionMixin.js'
    import CopyPasteMixin from './CopyPasteMixin.js'
    import ShareVar from './ShareVar.js'

    export default {
        name: "TableForm",
        directives: {
            onClickaway: onClickaway,
        },
        components:{
            ContextMenu,
            FormVirtualRow,
            ResizeableTH,
            ResizeCellWrapper,
            DragWrapper,
            Cell,
        },
        mixins:[
            SelectionMixin,
            CopyPasteMixin,
        ],
        props:{
            value: {
                required: true,
                type: Array,
            },
            options:{
                // options: { 
                //     head:[],
                // }

                //     head:{
                //         style: Object, // { styleName: styleValue }
                //         relatedKey: String,
                //         title: String,
                //         cellType: String,
                //         option: Object,
                //     }
                required: true,
                type: Object
            },
            isReadonly:{
                required: false,
                type: Boolean,
                default: () => false,
            },
            showSelection:{
                required: false,
                type: Boolean,
                default: () => false,
            }
        },
        data(){
            return {
                ...ShareVar,
                data: this.GetInitData(),
                defaultCountStyle:{
                    width: "80px",
                    "min-width": "80px",
                    height: "40px",
                },
                defaultColStyle:{
                    width: "200px",
                    "min-width": "200px",
                    height: "40px",
                },
                defaultRowStyle:{
                    height: "40px",
                },
                isTableFocus: false,
                isCellEditing: false,
                isShowTmpTR: false,
            }
        },
        watch:{
            value(new_value){
                this.data = new_value
            },
            data(){
                this.$emit('input', this.data)
            }
        },
        computed:{
            tableClass:{
                get(){
                    return {
                        "table-focus": this.isTableFocus,
                        "show-selection": this.isTableFocus || this.showSelection,
                    }
                }
            }
        },
        methods:{
            GetInitData(){
                // let numberOfColumns = this.options.head.length
                // let data = []
                // let value = this.value.length > 0 ? this.value : [{}]
                // for( let rowArray of value ){
                //     if (rowArray.length != numberOfColumns ) {
                //         // Get row default value
                //         let tmpRowArray = ShareVar.GetDefaultRow(this.options)
                //         data.push( tmpRowArray )
                //     }else{
                //         data.push( rowArray )
                //     }
                // }
                // return data
                
                // return this.value.length > 0 ? this.value : [ ShareVar.GetDefaultRow(this.options) ]
                return this.value.length > 0 ? this.value : []
            },
            EmitEvent(emitName, event){
                this.$emit( ShareVar[emitName], event )
            },
            GetColStyle(styles){
                return this.GetStyle(styles, this.defaultColStyle)
            },
            GetRowStyle(styles){
                return this.GetStyle(styles, this.defaultRowStyle)
            },
            GetStyle(styles, defaultStyles){
                let tmpStyle = { ...defaultStyles, ...styles }
                let tmp = []
                for( let styleName in tmpStyle ){
                    let style = tmpStyle[styleName]
                    tmp.push( `${styleName}:${style};` )
                }
                return tmp.join("")
            },
            HandleTableFocus(){
                this.isTableFocus = true
                this.$refs.table.focus()
            },
            HandleTableClickAway(){
                if(this.isMouseSelecting){
                    this.StopMouseSelecting()
                    return
                }
                this.isTableFocus = false
            },
            HandleCheckCellEditing(isCellEditing){
                this.isCellEditing = isCellEditing

                if (!isCellEditing) {
                    this.$refs.table.focus()
                }
            },
            HandleContextMenu(event){
                this.$refs.menu.open(event)
                this.HandleTableFocus()
            },
            HandleDefaultRowTdClick(){
                let tmpRowArray = ShareVar.GetDefaultRow(this.options)
                this.data.push(tmpRowArray)
                this.$emit('input', this.data)
                this.$emit(ShareVar.addRowEmitName,[{ newIndex: this.data.length - 1 }])
            },
        },
    }
</script>

<style lang="scss">
    @mixin vm-drop-shadow-1( $offset-x, $offset-y, $blur-radius, $shadow-color: #000000b3 ) {
        -webkit-filter: drop-shadow($offset-x $offset-y $blur-radius $shadow-color);
        filter: drop-shadow($offset-x $offset-y $blur-radius $shadow-color);
    }

    .TableForm{
        @include vm-drop-shadow-1(5px, 5px, 5px, #c5c3c3);
    }

    table.form-table td {
        font-size: 13px;
    }
    // ====================================
    // border

    table.form-table {
        border-spacing: 1px;
        border-collapse: separate;
    }

    $table-border-radius: 10px;
    $boder: 1px solid #e0e0e0;
    table.form-table th, 
    table.form-table td {
        border: $boder;
    }

    table.form-table.table-focus th, 
    table.form-table.table-focus td {
        border: $boder;
    }
    
    table.form-table{
        thead tr:first-child {
            th:first-child{
                border-top-left-radius: $table-border-radius;
            }
            th:last-child{
                border-top-right-radius: $table-border-radius;
            }
        }

        tbody tr:last-child{
            th:first-child{
                border-bottom-left-radius: $table-border-radius;
            }

            td:last-child{
                border-bottom-right-radius: $table-border-radius;
            }
        }
    }
    // ====================================
    // selection
    $border-width: 2px;
    $border-style: solid;
    $border-color: cornflowerblue;
    $background-color: aliceblue;

    table.form-table.show-selection{
        td.isSelected{
            background: $background-color;
        }

        td.highlight-border-top{
            border-top-width: $border-width;
            border-top-style: $border-style;
            border-top-color: $border-color;
        }
        td.highlight-border-bottom{
            border-bottom-width: $border-width;
            border-bottom-style: $border-style;
            border-bottom-color: $border-color;
        }
        td.highlight-border-left{
            border-left-width: $border-width;
            border-left-style: $border-style;
            border-left-color: $border-color;
        }
        td.highlight-border-right{
            border-right-width: $border-width;
            border-right-style: $border-style;
            border-right-color: $border-color;
        }
    }

    .form-table * {
        -webkit-box-sizing: border-box;
           -moz-box-sizing: border-box;
                box-sizing: border-box;
    }
    // ====================================
    table.form-table {
        table-layout: fixed;
        margin: 0;
    }

    .form-table thead {
        display: table-header-group;
        vertical-align: middle;
        border-color: inherit;
    }

    .form-table tbody {
        display: table-row-group;
        vertical-align: middle;
        border-color: inherit;
    }

    .form-table tr {
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
    }

    .form-table th {
        display: table-cell;
        vertical-align: inherit;
    }

    .form-table td {
        display: table-cell;
        vertical-align: inherit;
    }
    // ====================================

</style>

<style lang="scss" scoped>
    .TableForm{

        *::selection{
            background: unset;
        }

        .form-table{
            position: relative;
        }

        .form-table{
            thead, tbody{
                background-color: whitesmoke;

                td.default-row-td{
                    background-color: white;
                    cursor: pointer;
                }
            }
        }
    }
</style>
