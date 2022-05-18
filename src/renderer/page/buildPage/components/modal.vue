<template>
    <div :class="s.wrapper">
        <el-dialog v-model="showModal" title="配置项目信息" :lock-scroll="true" @close="closeModal">
            <el-form :model="data.form" ref="formRef">
                <el-form-item label="选择项目">
                    <el-select v-model="data.form.select" class="m-2" placeholder="Select" @change="selectChange">
                        <el-option
                            v-for="item in config"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="项目名称">
                    <el-input v-model="data.form.name" />
                </el-form-item>
                <el-form-item label="项目路径">
                    <input
                        v-show="inputShow"
                        @change="getFile"
                        id="attach-project-file"
                        ref="fileRef"
                        type="file"
                        webkitdirectory
                        directory
                    />
                    <el-input v-model="data.form.local_path" />
                    <el-button :class="s.select_btn" @click="selectFile">选择文件</el-button>
            <!-- <div :class="s.select_btn" @click="selectFile">点击选中文件</div> -->
                </el-form-item>
                <el-form-item label="目标路径">
                    <el-input v-model="data.form.server.target_path" />
                </el-form-item>
                <el-form-item label="服务器地址">
                    <el-input v-model="data.form.server.host" />
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="data.form.server.username" />
                </el-form-item>
                <el-form-item label="服务器密码">
                    <el-input v-model="data.form.server.password" type="password"/>
                </el-form-item>
                <el-form-item label="其他执行命令">
                    <el-input v-model="data.form.server.run"  :rows="2" type="textarea"/>
                </el-form-item>
            </el-form>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeModal">取消</el-button>
                <el-button type="primary" @click="confim"
                >确认</el-button
                >
            </span>
    </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed, watch} from "vue";
import config from '@/config'
import { useStore } from 'vuex'
const Store = window.require('electron-store');

const store = useStore()
const showModal = computed(() => store.state.showModal)

const selectChange = (value) => {
    console.log(value)
    setFromData(value)
}

const changeShowModal = (value) => store.commit('changeShowModal', value)
const closeModal = () => {
    changeShowModal(false)
    resetForm()
}

const modelShow = ref(true)
const data = reactive({
    form: {
        select: '',
        id: 0,
        name: '',
        local_path: '',
        server: {
            target_path: '', // 存放目录绝对地址
            host: '', //服务器
            username: '', // 服务器用户名
            password: '', 
            run: [
            ]
        }
    }
})


const setFromData = (idx) => {
    data.form = {
        ...config[idx],
        select: config[idx].name
    }
}
const fileRef = ref(null);
const selectFile = () => {
    console.log(fileRef.value.click())
}
const inputShow = ref(false)
const getFile = (e) => {
    console.log(' e.target.files', e.target.files[0].path)
    let arr = e.target.files[0].path.split('/')
    const len = arr.length
    arr.splice(len-1)
    data.form.local_path = arr.join('/')
}

const updateConfig = () => store.commit('updateConfig')
const formRef = ref(null)
const resetForm = () => {
    data.form = {
        select: '',
        id: 0,
        name: '',
        local_path: '',
        server: {
            target_path: '', // 存放目录绝对地址
            host: '', //服务器
            username: '', // 服务器用户名
            password: '', 
            run: [
            ]
        }
    }
}
const confim = () => {
    const eleStore = new Store()
    const arr = eleStore.get('project_list') || []
    arr.push(data.form)
    eleStore.set('project_list', arr)
    updateConfig()
    console.log('stor111e', eleStore.get('project_list'))
    closeModal()

} 
</script>
<style lang="scss" module="s">
.wrapper {

}
</style>
