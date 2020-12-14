'use strict'

import throttle from 'lodash.throttle'
import ShareVar from './ShareVar.js'

export default {
    data(){
        return {
            cellStatusArray: this.GetCellStatusArray(),
            selectedCells: [],
            currentCell: this.GetDefaultCurrentCell(),
            currentShiftCell: this.GetDefaultCurrentShiftCell(), // 就是用shift選取時corner的cell
            isMouseSelecting: false,
        }
    },
    watch:{
        data(newValue, oldValue){
            // 當 row 數增加，重設 cellStatusArray 並且重選剛剛有選的cell
            if (newValue.length > oldValue.length ) {
                this.InitSelection()
                this.SelectRangedCell()
            }

            // 當 row 數減少，重設 cellStatusArray 並調整選擇的cell
            if (newValue.length < oldValue.length ) {
                this.InitSelection()

                let that = this
                function CheckMinusRow(cell){
                    cell.row = that.numberOfRows <= cell.row ? that.numberOfRows - 1 : cell.row
                    cell.row = cell.row < 0 ? 0 : cell.row
                }
                CheckMinusRow(this.currentCell)
                CheckMinusRow(this.currentShiftCell)
                this.SelectRangedCell()
            }
        },
        currentCell:{
            handler(){
                this.InitCurrentShiftCell()
            },
            deep: true
        },
    },
    computed:{
        numberOfColumns:{
            get(){
                return this.options.head.length || 0
            }
        },
        numberOfRows:{
            get(){
                return this.data.length || 0
            }
        },
    },
    methods:{
        // ========================================================================
        // Handle Initilization
        Init(){
            let row = this.currentCell.row
            let col = this.currentCell.col
            this.cellStatusArray[row][col].isSelected = true            
            this.PushselectedCells(row, col)
            this.SetCurrentCell(row, col)
            this.SetSelectedCellsBorder()
        },
        InitSelection(){
            this.InitselectedCells()
            this.InitCellStatusArray()
        },
        InitselectedCells(){
            this.selectedCells = []
        },
        InitCellStatusArray(){            
            this.cellStatusArray = this.GetCellStatusArray()
        },
        // InitCurrentCell(){
        //     this.currentCell = this.GetDefaultCurrentCell()
        // },
        GetCellStatusArray(){
            let cellStatusArray = Array(this.numberOfRows).fill().map( () =>
                Array(this.numberOfColumns).fill().map( () => this.GetCellStatus() )
            )
            // console.log(cellStatusArray)
            return cellStatusArray
        },        
        GetCellStatus(){
            return {
                isSelected: false,
                "highlight-border-top": false,
                "highlight-border-bottom": false,
                "highlight-border-left": false,
                "highlight-border-right": false,
            }
        },
        GetIsSelected(rowIndex, colIndex){
            return this.cellStatusArray[rowIndex][colIndex]
        },
        GetCellClass(rowIndex, colIndex){
            try {
                return this.cellStatusArray[rowIndex][colIndex]
            } catch (error) {
                return {}
            }
        },
        // ========================================================================
        // CurrentCell & CurrentShiftCell
        GetDefaultCurrentCell(){
            return {
                row: 0,
                col: 0
            }
        },
        GetDefaultCurrentShiftCell(){
            return {
                row: 0,
                col: 0
            }
        },
        SetCurrentCell(row, col){
            row = row < 0 ? 0 : row
            row = row >= this.numberOfRows ? this.numberOfRows - 1 : row
            col = col < 0 ? 0 : col
            col = col >= this.numberOfColumns ? this.numberOfColumns - 1 : col
            this.currentCell.row = row
            this.currentCell.col = col
            this.InitCurrentShiftCell()
        },        
        SetCurrentShiftCell(row, col){
            row = row < 0 ? 0 : row
            row = row >= this.numberOfRows ? this.numberOfRows - 1 : row
            col = col < 0 ? 0 : col
            col = col >= this.numberOfColumns ? this.numberOfColumns - 1 : col
            this.currentShiftCell.row = row
            this.currentShiftCell.col = col
        },
        InitCurrentShiftCell(){
            this.currentShiftCell.row = this.currentCell.row
            this.currentShiftCell.col = this.currentCell.col
        },
        // ========================================================================
        // Handle Click Select
        HandleSelectRow(rowIndex){
            this.SetCurrentCell(rowIndex, 0)
            this.SetCurrentShiftCell(rowIndex, this.numberOfColumns - 1)
            this.SelectRangedCell()
        },        
        HandleSelectCell(rowIndex, colIndex){
            this.SetCurrentCell(rowIndex, colIndex)
            this.SelectRangedCell()
        },
        HandleSelectRangedCell(rowIndex, colIndex){
            if (this.isCellEditing) {
                return
            }

            this.SetCurrentShiftCell(rowIndex, colIndex)
            this.SelectRangedCell()
        },
        // ========================================================================
        // Handle Cell Mouse Select
        HandleCellMouseDown(rowIndex, colIndex){
            // console.log("HandleCellMouseDown", rowIndex, colIndex)
            if (this.isCellEditing) {
                return
            }
            this.isMouseSelecting = true
            this.HandleSelectCell(rowIndex, colIndex)
        },
        HandleCellMouseUp(rowIndex, colIndex){
            // console.log("HandleCellMouseUp", rowIndex, colIndex)
            if (this.isCellEditing) {
                return
            }
            this.isMouseSelecting = false
            this.SetCurrentShiftCell(rowIndex, colIndex)
            this.SelectRangedCell()
        },
        HandleCellMouseLeave(){
            if (this.isCellEditing) {
                return
            }

            if(!this.isMouseSelecting){
                return
            }

            this.SetCurrentShiftCell(this.currentShiftCell.row, this.currentShiftCell.col)
            this.SelectRangedCell()
        },
        HandleCellMouseMove: throttle(function(rowIndex, colIndex){
            if (this.isCellEditing) {
                return
            }

            if(!this.isMouseSelecting){
                return
            }

            this.SetCurrentShiftCell(rowIndex, colIndex)
            this.SelectRangedCell()
        }, 100),
        SelectRangedCell(){
            // select range by currentCell & currentShiftCell

            // console.log("HandleCellMouseMove", rowIndex, colIndex)
            if (this.isCellEditing) {
                return
            }

            if (this.numberOfColumns <= 0 || this.numberOfRows <= 0){
                return
            }

            // from Form.vue
            this.HandleTableFocus()

            this.InitSelection()
            // console.log("HandleCellMouseMove", this.currentCell, rowIndex, colIndex)
            // console.log("selectedStartCell", selectedStartCell)
            // console.log(this.cellStatusArray, rowIndex, colIndex)

            let minRow = Math.min(this.currentCell.row, this.currentShiftCell.row)
            let maxRow = Math.max(this.currentCell.row, this.currentShiftCell.row)
            let minCol = Math.min(this.currentCell.col, this.currentShiftCell.col)
            let maxCol = Math.max(this.currentCell.col, this.currentShiftCell.col)

            for(let row = minRow; row <= maxRow; row++){
                for(let col = minCol; col <= maxCol; col++){
                    this.cellStatusArray[row][col].isSelected = true   
                    this.PushselectedCells(row, col)
                }
            }
            this.SetSelectedCellsBorder()
            // console.log( this.selectedCells )
        },
        // ========================================================================
        // Handle Keyboard
        HandleKeyboardArrow(direction){
            if (this.isCellEditing) {
                return
            }

            // console.log( "Arrow", direction )
            switch (direction) {
                case "up":
                    this.SetCurrentCell(this.currentCell.row - 1, this.currentCell.col)
                    break
                case "down":
                    this.SetCurrentCell(this.currentCell.row + 1, this.currentCell.col)
                    break
                case "left":
                    this.SetCurrentCell(this.currentCell.row, this.currentCell.col - 1)
                    break
                case "right":
                    this.SetCurrentCell(this.currentCell.row, this.currentCell.col + 1)
                    break            
                default:
                    return
            }
            this.SelectRangedCell()
        },
        HandleKeyboardShiftArrow(direction){
            if (this.isCellEditing) {
                return
            }

            // console.log( "Shift + Arrow", direction )
            switch (direction) {
                case "up":
                    this.SetCurrentShiftCell(this.currentShiftCell.row - 1, this.currentShiftCell.col)
                    break
                case "down":
                    this.SetCurrentShiftCell(this.currentShiftCell.row + 1, this.currentShiftCell.col)
                    break
                case "left":
                    this.SetCurrentShiftCell(this.currentShiftCell.row, this.currentShiftCell.col - 1)
                    break
                case "right":
                    this.SetCurrentShiftCell(this.currentShiftCell.row, this.currentShiftCell.col + 1)
                    break            
                default:
                    return
            }
            this.SelectRangedCell()
        },      
        HandleKeyboardEnter(){
            this.$nextTick( () => {
                this.$refs[this.GetCellRefName(this.currentCell.row, this.currentCell.col)][0].Enter()
            })
        },
        HandleSetCellDefault(){
            let that = this
            if (this.isCellEditing) {
                return
            }

            if (that.isReadonly) {
                return
            }
            
            let emitData = []
            that.selectedCells.forEach( (cell) => {
                let cellType = that.options.head[cell.col].cellType
                let relatedKey = that.options.head[cell.col].relatedKey
                let oldValue = JSON.parse( JSON.stringify(that.data[cell.row][relatedKey]) )
                let newValue = ShareVar.defaultValue[cellType]()

                if( oldValue != newValue ){
                    emitData.push({
                        rowIndex: cell.row,
                        relatedKey: relatedKey,
                        oldValue: oldValue,
                        newValue: newValue, 
                    })
                }

                that.data[cell.row][relatedKey] = newValue
            })
            this.data = Object.assign([], this.data, this.data)
            if( emitData.length > 0 ){
                this.$emit( ShareVar.emptyCellEmitName, emitData )
            }
        },
        HandleDeleteSelectedRow(){
            let that = this
            if (that.isReadonly) {
                return
            }

            let rows = Array.from( new Set( that.selectedCells.map( cell => cell.row ) ) )
                .sort().reverse()
            // console.log(rows)
            let removedRows = []
            rows.forEach( row => removedRows.push(...that.data.splice(row, 1)) )
            removedRows.reverse()
            this.data = Object.assign([], this.data, this.data)


            let startRowIndex = Math.min(...rows)
            let endRowIndex = Math.max(...rows)
            let numberOfRowsMove = endRowIndex - startRowIndex
            let moveRows = []
            for( let row = startRowIndex; row < this.data.length; row++ ){
                moveRows.push({
                    oldIndex: row + numberOfRowsMove,
                    newIndex: row,
                })
            }

            this.$emit(ShareVar.removeRowsEmitName, rows.map( (row, idx) => ({ oldIndex: row, value: removedRows[idx] }) ))
            this.$emit(ShareVar.moveRowEmitName, moveRows)
        },
        // ========================================================================
        // Helping Methods
        PushselectedCells(rowIndex, colIndex){
            this.selectedCells.push(this.GetselectedCellsInfo(rowIndex, colIndex))
        },
        GetselectedCellsInfo(row, col){
            // { row: Number, col: Number, sum: Number }
            return { row, col, sum: row+col }
        },
        GetSelectedStartCell(){
            let minSum = Math.min.apply(Math, this.selectedCells.map(cell => cell.sum))
            let selectedStartCell = this.selectedCells.filter( (x) => x.sum == minSum )[0]
            return selectedStartCell
        },
        GetSelectedEndCell(){
            let maxSum =  Math.max.apply(Math, this.selectedCells.map(cell => cell.sum))
            let selectedEndCell = this.selectedCells.filter( (x) => x.sum == maxSum )[0]
            return selectedEndCell
        },
        SetSelectedCellsBorder(){
            // 選取一個區域時，最左上角的cell，row+col會是最小，最右下角會是最大
            // 可以利用這個特性選找"起始"跟"結尾"，來計算出selected cell中，border要不要變粗顯示
            if(this.selectedCells.length == 0) return

            // find out corner
            let selectedStartCell = this.GetSelectedStartCell()
            let selectedEndCell = this.GetSelectedEndCell()
            // console.log(selectedStartCell, selectedEndCell)

            let row = 0
            let col = 0
            // handle Top Border
            row = selectedStartCell.row
            for( col = selectedStartCell.col; col <= selectedEndCell.col; col++ ){
                this.cellStatusArray[row][col]["highlight-border-top"] = true
            }

            // handle Bottom Border
            row = selectedEndCell.row
            for( col = selectedStartCell.col; col <= selectedEndCell.col; col++ ){
                this.cellStatusArray[row][col]["highlight-border-bottom"] = true
            }

            // handle left Border
            col = selectedStartCell.col
            for( row = selectedStartCell.row; row <= selectedEndCell.row; row++ ){
                this.cellStatusArray[row][col]["highlight-border-left"] = true
            }

            // handle right Border
            col = selectedEndCell.col
            for( row = selectedStartCell.row; row <= selectedEndCell.row; row++ ){
                this.cellStatusArray[row][col]["highlight-border-right"] = true
            }
        },
        StopMouseSelecting(){
            this.isMouseSelecting = false
        },
    },
    mounted(){
        this.Init()
    }
}