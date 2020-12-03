
import Form from '@/components/Form.vue'
import FormSettings from '@/components/ShareVar.js'

const Components = [
    Form
]

const install = function (Vue, opts = {}) {
    Components.forEach(component => {
        Vue.component(component.name, component)
    })
}

export default {
    install,
    ...FormSettings,
}