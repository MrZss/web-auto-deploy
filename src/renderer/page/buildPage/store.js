import { createStore } from 'vuex'
const Store = require('electron-store');
const eleStore = new Store()

const store = createStore({
    state () {
        return {
            cmd_list: [],
            count: 0,
            present: -1,
            showModal: false,
            configList: [],
            selectIndex: 0
        }
    },
    getters: {
        selectConfig: (state) => {
            if(!state.configList.length) return {}
            return state.configList[state.selectIndex]
        }
    },
    mutations: {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
        addList (state, line) {
            state.cmd_list.push(line)
            state.count =  state.cmd_list.length
        },
        clearList(state, line) {
            state.cmd_list = []
        },
        addPresent(state, present){
            state.present = present
        },
        cleanPresent(state, present){
            state.present = -1
        },
        changeShowModal(state, show){
            state.showModal = show
            console.log('state.showModal',state.showModal)
        },
        updateConfig(state){
            state.configList = eleStore.get('project_list') || []
            console.log('state.configList',state.configList)
        },
        updateSelectIndex(state, index){
            state.selectIndex = index
            // store.commit('clearList')
        }
    }
})

export default store;
