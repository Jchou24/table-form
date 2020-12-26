<template>
    <div id="app">
        <div class="Demo"
            @keyup.ctrl.67.exact="keyboardNotification('ctrl + c')"
            @keyup.ctrl.86.exact="keyboardNotification('ctrl + v')"
            @keyup.46.exact="keyboardNotification('delete')"
            @keyup.shift.46.exact="keyboardNotification('shift + delete')"
            @keyup.enter.exact="keyboardNotification('enter')"
            @keyup.shift.enter.exact="keyboardNotification('shift + enter')"
            >

            <section>
                <div>
                    <h1>TODO</h1>

                    <TableForm class="t1" v-model="todo"
                        :options="options"
                        showSelection 
                        @addRows="RowsNotification('Todo: Add Row', $event)"
                        @removeRows="RowsNotification('Todo: Remove Row', $event)"
                        @moveRows="RowsNotification('Todo: Move Row', $event)"
                        @emptyCells="RowsNotification('Todo: Empty Cell', $event)"
                        @modifyCells="RowsNotification('Todo: Modify Cell', $event)"
                        />
                </div>

                <VueJsonPretty :data="todo" />
            </section>

            <hr>

            <section>
                <div>
                    <h1>Done</h1>
                    
                    <TableForm class="t2" v-model="done" 
                        :options="options"
                        :isReadonly="false"
                        @addRows="RowsNotification('Done: Add Row', $event)"
                        @removeRows="RowsNotification('Done: Remove Row', $event)"
                        @moveRows="RowsNotification('Done: Move Row', $event)"
                        @emptyCells="RowsNotification('Done: Empty Cell', $event)"
                        @modifyCells="RowsNotification('Done: Modify Cell', $event)"
                        />
                </div>

                <VueJsonPretty :data="done" />
            </section>

            <hr>

            <section>
                <div>
                    <textarea/>
                </div>
            </section>

            <notifications group="note" />
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'

    import Notifications from 'vue-notification'

    import VueJsonPretty from 'vue-json-pretty'

    import TableForm from '@/components/TableForm.vue'
    import FormSettings from '@/components/ShareVar.js'

    Vue.use(Notifications)

    export default {
        name: "Demo",
        components:{
            VueJsonPretty,
            TableForm
        },
        data(){
            return {
                options:{
                    head:[{
                            title: "Learning Time",
                            relatedKey: "learningTime",
                            cellType: FormSettings.cellTypes.number,
                            style:{
                                width: "80px",
                                "min-width": "80px",
                            },
                            options:{
                                step: 0.5,
                                min: 0,
                                max: 8,
                            },
                        },{
                            title: "Language",
                            relatedKey: "language",
                            cellType: FormSettings.cellTypes.singleSelect,
                            options: [{
                                value: 0, name: '' },{
                                value: 1, name: 'Python' },{
                                value: 2, name: 'Javascript' },{
                                value: 3, name: 'Java' },{
                                value: 4, name: 'C#' },{
                                value: 5, name: 'C++' },{
                                value: 6, name: 'Html' },{
                                value: 7, name: 'CSS'
                                }],
                        },{
                            title: "Description",
                            relatedKey: "description",
                            cellType: FormSettings.cellTypes.textarea,
                            options:{
                                maxLength: 20,
                                isSuggestions: true,
                                throttle: 250,
                                suggestions: [ "learning refactoring" ]
                            },
                    }]
                },
                todo: [{
                        learningTime: 1.5,
                        language: 1,
                        description: "learning lession 3+4",
                    },{
                        learningTime: 2.0,
                        language: 2,
                        description: "learning 'this'",
                    },
                ],
                done: [{
                        learningTime: 3.0,
                        language: 1,
                        description: "learning lession 1+2",
                    },{
                        learningTime: 4.0,
                        language: 2,
                        description: "learning introduction",
                    },
                ],
            }
        },
        methods:{
            keyboardNotification(message){
                this.$notify({
                    group: 'note',
                    title: 'Keyboard Event',
                    text: message,
                    type: 'success',
                });
            },
            RowsNotification(title, event){
                console.log(title)
                console.table(event)
                this.$notify({
                    group: 'note',
                    title: title,
                    text: `#Row(s): ${event.length}`,
                    type: 'success',
                });
            },
        },
        
    }
</script>

<style lang="scss">

    .t1{
        position: relative;
        z-index: 1;
    }

    .t2{
        position: relative;
    }

    .vue-notification {
        padding: 10px;
        margin: 0 5px 5px;

        font-size: 20px;

        color: #ffffff;
        background: #44A4FC;
        border-left: 5px solid #187FE7;

        &.warn {
            background: #ffb648;
            border-left-color: #f48a06;
        }

        &.error {
            background: #E54D42;
            border-left-color: #B82E24;
        }

        &.success {
            background: #68CD86;
            border-left-color: #42A85F;
        }

        .notification-title{
            margin-bottom: 8px;
        }

        .notification-content{
            margin-left: 15px;
        }
    }
</style>>

<style lang="scss" scoped>
    .Demo{
        section{
            display: flex;

            div{
                margin: 20px;
            }

            h1{
                margin-bottom: 20px;
            }

            textarea{
                height: 100px;
                width: 500px;
            }
        }
    }
</style>
