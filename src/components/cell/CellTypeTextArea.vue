<template>
    <CellWrapper class="CellTypeTextArea" :text="data" :isReadonly="isReadonly" @checkCellEditing="HandleCheckCellEditing" ref="cellWrapper">
        <textarea class="CellTypeTextArea-editor"
            v-model="data"
            :maxlength="maxLength"
            @input="HandleInput"
            
            @keydown="HandleKeyDown"
            @keydown.enter.exact.prevent
            @keyup.enter.exact.prevent
            @keydown.enter.shift.exact="Newline"
            ref="editor"
        />
    </CellWrapper>
</template>

<script>
    import Awesomplete from 'awesomplete/awesomplete.js'
    import 'awesomplete/awesomplete.css'

    import CellMixin from './CellMixin.js'
    import ShareVar from '../ShareVar.js'

    function GetLastCharacter(s){
        return s.slice(s.length - 1)
    }

    export default {
        name: "CellTypeTextArea",
        mixins:[
            CellMixin
        ],
        props:{
            value: {
                // override CellMixin.js
                required: true,
                type: ShareVar.valueTypes.textarea,
                default: ShareVar.defaultValue.textarea,
            },
            options: {
                // ex
                // { 
                //    maxLength: Number ,
                //    isSuggestions: boolean
                // }
                required: true,
                type: Object,
            },
            rowIndex:{
                required: true,
                type: Number,
            },
            colIndex:{
                required: true,
                type: Number,
            },
        },
        data(){
            return {
                autocompleteHandler: null,
                isLaunchAutocomplete: false,
            }
        },
        watch:{
            data(newValue, oldValue){
                if (newValue.length > this.maxLength) {
                    // limit text by text length
                    this.data = this.data.slice(0, this.maxLength)
                }
            },
            suggestions(){
                if( !this.autocompleteHandler ){
                    return
                }

                this.autocompleteHandler.list = this.suggestions
            },
        },
        computed:{
            maxLength:{
                get(){
                    return this.options.maxLength || 100
                }
            },
            isSuggestions:{
                get(){
                    return this.options.isSuggestions || true
                }
            },
            suggestions:{
                get(){
                    // Array of string, used for text autocomplete
                    if (!this.isSuggestions) {
                        return []
                    }

                    let candidates = {} // { words: word count }
                    this.formData.forEach( (data, idx) => {
                        if (idx == this.rowIndex) {
                            return
                        }

                        let string = data[this.colIndex]
                        if (!(string in candidates)) {
                            candidates[string] = 0
                        }
                        candidates[string]++
                    })

                    // get sorted suggestions by word count
                    let suggestions = Object.keys(candidates).sort(function(a,b){return candidates[a]-candidates[b]}).reverse()
                    return suggestions
                }
            }
        },
        methods:{
            InitAutoComplete(){
                this.autocompleteHandler = new Awesomplete(this.$refs.editor, { 
                    list: this.suggestions,
                    maxItems: 10,
                    minChars: 2,
                })

                this.$refs.editor.addEventListener("awesomplete-open", this.HandleAwesompleteOpen)
                this.$refs.editor.addEventListener("awesomplete-close", this.HandleAwesompleteClose)
                this.$refs.editor.addEventListener("awesomplete-selectcomplete", this.HandleAwesompleteSelectComplete)
            },
            RecycleAutoComplete(){
                this.$refs.editor.removeEventListener("awesomplete-open", this.HandleAwesompleteOpen)
                this.$refs.editor.removeEventListener("awesomplete-close", this.HandleAwesompleteClose)
                this.$refs.editor.removeEventListener("awesomplete-selectcomplete", this.HandleAwesompleteSelectComplete)

                if( !this.autocompleteHandler ){
                    return
                }

                this.autocompleteHandler.destroy()                
            },
            Focus(){
                this.$refs.editor.focus()
            },
            HandleKeyDown(evt){
                // console.log( "keydown", evt )
            },
            Newline() {
                this.data = `${this.data}\n`
                this.$emit('input',this.data)
            },
            HandleInput(evt){
                if (evt && evt.inputType == "insertLineBreak") {
                    this.data = this.data.slice(0, this.data.length - 1)
                }
                // console.log("Input", evt)
                // console.log( this.data.length )
                // console.log( this.data )
                this.$emit('input',this.data)
            },
            HandleCheckCellEditing(isCellEditing){
                if (isCellEditing) {
                    this.$nextTick(() => {
                        this.InitAutoComplete()
                    })
                }else{
                    this.RecycleAutoComplete()
                }

                CellMixin.methods.HandleCheckCellEditing.call(this, isCellEditing)
            },
            HandleAwesompleteOpen(){
                this.isLaunchAutocomplete = true
                // console.log( "awesomplete-open", this.isLaunchAutocomplete )
            },
            HandleAwesompleteClose(){
                // this.isLaunchAutocomplete = false
                // console.log( "awesomplete-close", this.isLaunchAutocomplete )
            },
            HandleAwesompleteSelectComplete(event){
                this.data = event.text.value
                this.HandleInput()
                // console.log( "awesomplete-selectcomplete", this.data, event )
            },
            Enter(){
                // console.log("ENTER", "isLaunchAutocomplete", this.isLaunchAutocomplete)
                this.$nextTick(() => {
                    if (this.$refs.cellWrapper.isDisplayDataMode) {
                        this.$refs.cellWrapper.HandleKeyboardEnter()
                    }else{
                        if (this.isLaunchAutocomplete) {
                            this.isLaunchAutocomplete = false
                        }else{
                            this.$refs.cellWrapper.HandleKeyboardEnter()
                        }
                    }                    
                })
            },
        },
    }
</script>

<style lang="scss">
    // ========================
    // 調整cell滿版
    .awesomplete{
        height: 100%;
        width: 100%;
        display: block;
    }

    .CellTypeTextArea{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    // ========================
    // 調整建議清單位置
    .awesomplete > ul{
        top: 2em;
        // bottom: 0;
        // bottom: -1.43em;
        // margin-top: 20%;
    }
    // ========================
    // 調整建議選單match字元顏色
    .awesomplete mark{
        // background: aliceblue;
        // background: cornflowerblue;
        background: none !important;
        // color: aliceblue;
        font-weight: 700;
    }

    .awesomplete li[aria-selected="true"] mark{
        background: hsl(205, 40%, 20%);
    }

    
</style>

<style lang="scss" scoped>
    .CellTypeTextArea-editor{
        position: absolute;
        top:0px;
        left:0px;

        height: inherit;
        width: inherit;

        background: none;
        border: none;
        resize: none;
    }
</style>
