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

    return tmpRowArray
}

function GetCellRefName(rowIndex, colIndex){
    return `${rowIndex}_${colIndex}`
}

export default {
    resizeTriggerBlockRowClass: "resize-trigger-block-row",
    resizeTriggerBlockColClass: "resize-trigger-block-col",
    startResizeRowEmitName: "startResizeRow",
    startResizeColEmitName: "startResizeCol",
    cellTypes,
    valueTypes,
    defaultValue,
    GetDefaultRow,
    GetCellRefName,
}