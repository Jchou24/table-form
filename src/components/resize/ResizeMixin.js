'use strict'

import ShareVar from '../ShareVar.js'

export default {
    props:{
        ResizeDirection:{
            type: String,
            default: () => null,
            validator: function (value) {
                // The value must match one of these strings
                return ['row', 'col', null, ''].indexOf(value) !== -1
            }
        }
    },
    data(){
        return {
            ...ShareVar,
        }
    }
}