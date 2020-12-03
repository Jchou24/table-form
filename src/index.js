import Vue from 'vue'

import TableForm from '@/components/TableForm.vue'
// import FormVirtualRow from '@/components/FormVirtualRow.vue'
// import DragWrapper from '@/components/DragWrapper.vue'

// import FormLighter from '@/components/resize/FormLighter.vue'
// import ResizeableTH from '@/components/resize/ResizeableTH.vue'
// import ResizeLine from '@/components/resize/ResizeLine.vue'

// import Cell from '@/components/cell/Cell.vue'
// import CellDisplay from '@/components/cell/CellDisplay.vue'
// import CellTypeNumber from '@/components/cell/CellTypeNumber.vue'
// import CellTypeSingleSelect from '@/components/cell/CellTypeSingleSelect.vue'
// import CellTypeTextArea from '@/components/cell/CellTypeTextArea.vue'
// import CellWrapper from '@/components/cell/CellWrapper.vue'

const Components = {
    TableForm,
    // FormVirtualRow,
    // DragWrapper,
    // FormLighter,
    // ResizeableTH,
    // ResizeLine,
    // Cell,
    // CellDisplay,
    // CellTypeNumber,
    // CellTypeSingleSelect,
    // CellTypeTextArea,
    // CellWrapper,
}

Object.keys(Components).forEach( name =>{
    Vue.component(name, Components[name])
})

export default Components