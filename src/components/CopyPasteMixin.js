'use strict'

import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

import ShareVar from './ShareVar.js'
import ArrayHandler from './util/ArrayHandler.js'

Vue.use(VueClipboard)

export default {
    data(){
        return {
            clipboard:{
                copiedData: null,
                isProcessingPaste: false,
            }
        }
    },
    watch:{
        clipboard:{
            handler(newValue){
                // console.log("watch clipboard", newValue.copiedData != null && newValue.isProcessingPaste == true, newValue)
                if( newValue.copiedData != null && newValue.isProcessingPaste == true){
                    this.PasteDataToTable()
                }
            },
            deep: true
        }
    },
    computed:{
        
    },
    methods:{
        // ========================================================================
        // Handle Copy
        HandleCopy(event){
            // console.log("HandleCopy")
            let that = this
            that.$clipboardConfig.appendToBody = false // set false to avoid losing table focus
            if (that.isCellEditing) {
                return 
            }
            
            // 1. get value of selectedCells
            // 2. transform to row string by  "", "", "" ...
            // 3. store data to clipboard
            // * assuming selectedCells is only one row

            let value = that.GetValueOfSelectedCells()
            let serialize = that.Serialize(value)            
            // console.log( value )
            // console.log( serialize )
            
            that.$copyText(serialize).then(function(x){
                // console.log(x)
                // still focus table( $copyText will break table focus )
                setTimeout(function(){
                    that.HandleTableFocus()
                    that.$refs.table.click()
                }, 100)
            })
        },
        GetValueOfSelectedCells(){
            let that = this
            let value = []

            let selectedStartCell = that.GetSelectedStartCell()
            let selectedEndCell = that.GetSelectedEndCell()

            for( let row = selectedStartCell.row; row <= selectedEndCell.row; row++ ){
                let newRow = []
                for( let col = selectedStartCell.col; col <= selectedEndCell.col; col++ ){
                    // newRow.push(`${QUOTE}${that.data[row][col]}${QUOTE}`)    
                    // newRow.push(`${that.data[row][col]}`)
                    let relatedKey = that.options.head[col].relatedKey
                    newRow.push(that.data[row][relatedKey])
                }
                value.push(newRow)
            }
            return value
        },
        Serialize(array){
            return JSON.stringify(array)
        },
        // ========================================================================
        // Handle Paste
        // 由於 @paste 在talbe上會失靈(點選th後會無法觸發@paste)，因此需要更複雜的機制來進行處理
        // 真正執行paste行為的是PasteDataToTable
        // 觸發paste的地方有兩處，一個是talbe的@keyup.ctrl.86
        // 另一個是mounted()中之document.addEventListener('paste', this.HandleDocumentPaste)
        // 當兩處的event handler都被觸發，才可以執行PasteDataToTable
        // 實際作法: 
        //     HandlePaste         調整 this.clipboard.isProcessingPaste
        //     HandleDocumentPaste 調整 this.clipboard.copiedData
        //     當 watch 到 this.clipboard 中之 isProcessingPaste & copiedData 都有被異動
        //     才去執行PasteDataToTable
        HandlePaste(event){
            // console.log("HandlePaste", event)
            if (this.isReadonly || this.isCellEditing) {
                return 
            }

            this.clipboard.isProcessingPaste = true
            this.clipboard = Object.assign({}, this.clipboard, this.clipboard)
        },
        HandleDocumentPaste(event){
            // console.log("HandleDocumentPaste", event)
            if (this.isReadonly || this.isCellEditing) {
                return 
            }

            this.clipboard.copiedData = this.GetClipboardData(event)
            this.clipboard = Object.assign({}, this.clipboard, this.clipboard)
        },
        // ========================================================================
        // Handle Paste to table
        PasteDataToTable(){
            // 1. get clipboardData text data
            // 2. parsing to 2d array
            // 3. transform value in array
            // 4. try replacing value from currentCell
            // console.log("PasteDataToTable", event)
            if (this.isReadonly || this.isCellEditing || !this.clipboard.copiedData) {
                return 
            }

            let array = this.Deserialize(this.clipboard.copiedData)
            // console.log(array)
            let isTransformOk = this.InPlaceTypeTransform(array)
            // console.log(isTransformOk, array)
            if (isTransformOk) {
                this.ReplaceTableData(array)   
            }

            this.clipboard.isProcessingPaste = false
            this.clipboard.copiedData = null
            this.clipboard = Object.assign({}, this.clipboard, this.clipboard)
        },
        GetClipboardData(event){
            // console.log(event)
            // console.log( (event.clipboardData || window.clipboardData) )

            let clipboardData = (event.clipboardData || window.clipboardData)
            return clipboardData?.getData('text/plain') || clipboardData?.getData('Text');
        },
        Deserialize(str){
            try {
                let array = JSON.parse(str)
                let dimension = ArrayHandler.GetDim(array).length

                switch (dimension) {
                    case 1:
                        return [array]    
                    case 2:
                        return array
                    default:
                        return [[]]
                }
            } catch (error) {
                return [[str]]
            }
        },
        InPlaceTypeTransform(array){
            // console.log( "InPlaceTypeTransform" )
            let that = this
            let isTransformOk = true
            let cellOffset = this.GetCellOffset(array)

            if (cellOffset == null) {
                return false
            }

            let dimension = ArrayHandler.GetDim(array)
            // console.log(dimension)
            for( let row = 0; row < dimension[0]; row++ ){
                for( let col = 0; col < dimension[1]; col++ ){
                    let cellType = that.options.head[col + cellOffset].cellType
                    let valueType = ShareVar.valueTypes[cellType]
                    let transformedValue = valueType(array[row][col])

                    isTransformOk = that.IsValidTransform(valueType, transformedValue)
                    // console.log(transformedValue, isTransformOk)
                    array[row][col] = transformedValue
                }
            }
            return isTransformOk
        },
        IsValidTransform(valueType, transformedValue){
            switch (typeof(valueType())) {
                case "number":
                    if(isNaN(transformedValue)){
                        return false
                    }
                    break;

                case "string":
                    break;
            
                default:
                    break;
            } 
            return true
        },
        GetCellOffset(array){
            let that = this
            let cellOffset = this.currentCell.col

            let dimension = ArrayHandler.GetDim(array)
            let numberOfArrayCols = dimension[1]
            function IsOverArraySize(cellOffset){
                return numberOfArrayCols + cellOffset > that.numberOfColumns
            }
            
            // 若最後一個元素之index+當前選取之cell之col會超過table中之row的長度，則無法轉換
            if( IsOverArraySize(cellOffset) ){
                cellOffset = 0
                // 若從第0個開始做對應處理，長度超過table中之row的長度，則無法轉換
                if( IsOverArraySize(cellOffset) ){
                    cellOffset = null
                }
            }

            // console.log("cellOffset", cellOffset)
            return cellOffset
        },
        ReplaceTableData(array){
            let cellOffset = this.GetCellOffset(array)

            if (cellOffset == null) {
                return false
            }

            
            let dimension = ArrayHandler.GetDim(array)
            let numberOfArrayRows = dimension[0]
            let numberOfArrayCols = dimension[1]
            let currentNumberOfArrayRows = this.data.length
            // ===========================================================================
            // for recover losed rows
            let losedRows = this.currentCell.row + numberOfArrayRows - this.numberOfRows
            for( let row = 0; row < losedRows; row++ ){
                let tmpRowArray = ShareVar.GetDefaultRow(this.options)
                this.data.push(tmpRowArray)
            }
            // ===========================================================================
            // replace araay value to data
            let dataRow = 0
            let dataCol = 0

            let modifiedCells = []
            for( let row = 0; row < numberOfArrayRows; row++ ){
                for( let col = 0; col < numberOfArrayCols; col++ ){
                    dataRow = row + this.currentCell.row
                    dataCol = col + cellOffset
                    let relatedKey = this.options.head[dataCol].relatedKey

                    if (dataRow < currentNumberOfArrayRows) {
                        modifiedCells.push({
                            rowIndex: dataRow,
                            relatedKey: relatedKey,
                            oldValue: JSON.parse(JSON.stringify(this.data[dataRow][relatedKey])),
                            newValue: JSON.parse(JSON.stringify(array[row][col])),
                        })
                    }                    
                    
                    this.data[dataRow][relatedKey] = array[row][col]
                }
            }
            // ===========================================================================
            // emit modified cell(s)            
            if ( modifiedCells.length > 0 ) {
                this.$emit( ShareVar.cellModifiedEmitName, modifiedCells )
            }
            // ===========================================================================
            // emit adding row if exists
            let newRow = []
            for (let row = this.currentCell.row + 1; row < this.currentCell.row + numberOfArrayRows; row++) {
                newRow.push({ newIndex: row })                
            }

            if( newRow.length > 0 ){
                this.$emit( ShareVar.addRowEmitName, newRow )
            }
            // ===========================================================================
            // reselect cells
            this.SetCurrentCell(this.currentCell.row, cellOffset)
            this.SetCurrentShiftCell(dataRow, dataCol)
            this.SelectRangedCell()
            this.data = Object.assign([], this.data, this.data)
        },        
    },
    mounted(){        
        document.addEventListener('paste', this.HandleDocumentPaste)
    },
    beforeDestroy(){
        document.removeEventListener('paste', this.HandleDocumentPaste)
    }
}