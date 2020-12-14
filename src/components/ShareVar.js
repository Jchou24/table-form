'use strict'

let cellTypes = {
    singleSelect: "singleSelect",
    number: "number",
    textarea: "textarea",
}

let defaultValue = {
    singleSelect: () => 0,
    number: () => 0.0,
    textarea: () => "",
}

let valueTypes = {
    singleSelect: Number,
    number: Number,
    textarea: String,
}

function GetDefaultRow(options){
    let numberOfColumns = options.head.length
    let tmpRowArray = Array(numberOfColumns).fill(undefined)
    for(let idx in options.head){
        let cellType = options.head[idx].cellType
        tmpRowArray[idx] = defaultValue[cellType]()
    }

    let tmpRow = {}
    tmpRowArray.forEach((valueOfCell, colIndex) => {
        let relatedKey = options.head[colIndex].relatedKey
        tmpRow[relatedKey] = valueOfCell
    })

    return tmpRow
}

function GetCellRefName(rowIndex, colIndex){
    return `${rowIndex}_${colIndex}`
}

export default {
    resizeTriggerBlockRowClass: "resize-trigger-block-row",
    resizeTriggerBlockColClass: "resize-trigger-block-col",
    startResizeRowEmitName: "startResizeRow",
    startResizeColEmitName: "startResizeCol",
    resizedRowEmitName: "resizedRow",
    resizedColEmitName: "resizedCol",
    addRowEmitName: "addRows",
    removeRowsEmitName: "removeRows",
    moveRowEmitName: "moveRows",
    cellModifiedEmitName: "modifyCells",
    emptyCellEmitName: "emptyCells",
    cellTypes,
    valueTypes,
    defaultValue,
    GetDefaultRow,
    GetCellRefName,
}