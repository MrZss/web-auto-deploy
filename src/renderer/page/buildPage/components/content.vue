<template>
    <div :class="s.wrapper">
        <div :class="s.top">
            <el-select v-model="selectValue" class="m-2" placeholder="Select">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                />
            </el-select>
            <el-button type="primary" id="push_btn" :class="s.push_btn" :loading="btn_loading" @click="run">发布/部署</el-button>
        </div>
        <div :class="s.info">
            <el-descriptions title="配置信息" :column="3" border >
                <el-descriptions-item
                    label="项目"
                    label-align="right"
                    align="center"
                    label-class-name="my-label"
                    class-name="my-content"
                    width="100px"
                >
                <div style="width:140px">{{`${config.name}`}}</div></el-descriptions-item
                >
                <el-descriptions-item label="执行用户名" label-align="right" align="center" width="100px"
                    >{{config.server.username}}</el-descriptions-item
                >
                <el-descriptions-item label="远端服务器" label-align="right" align="center" width="130px"
                    >{{config.server.host}}</el-descriptions-item
                >
                <el-descriptions-item label="部署环境" label-align="right" align="center">
                <el-tag v-if="selectValue === 'test'">测试环境</el-tag>
                <el-tag v-else type="danger">生产环境</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="目标路径" label-align="right" align="center"
                    >{{config.server.target_path}}</el-descriptions-item
                >
            </el-descriptions>
        </div>
        <div :class="s.progress">
            <el-steps :active="active" style="height: 50px"  process-status="wait" finish-status="success" align-center>
                <el-step title="确认发布项目/路径" />
                <el-step title="项目打包/压缩"  />
                <el-step title="上传压缩包" />
                <el-step title="部署完成"  />
            </el-steps>
        </div>
        <div :class="s.cmd" id="cmd">
            <div :class="s.line" v-if="present >= 0">
                正在构建-build：
                <div style="width: 600px">
                    <el-progress :text-inside="true"  :stroke-width="20" :percentage="present" />
                </div>
                <div v-loading="present < 100 && present >=0" style="margin-right: 12px"></div>
            </div>
            <span v-for="(row,index) in cmd_list" :key="index" :class="s.line">
                <span :class="s.arrow">></span>
                    <div v-html="row"></div>
                </span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch} from "vue";
import build from '../util/build'
import uploadFile from '../util/upload'
import log from '../util/log'
import { useStore } from 'vuex'
const store = useStore()
const selectValue = ref<string>('test')

const options = reactive<any[]>([
    {
        name: '测试环境',
        value: 'test'
    },
    {
        name: '生产环境',
        value: 'produce'
    }

])

const config = computed(() => store.getters.selectConfig)

const active = ref(1)

const scrollBottom = () => {
    let dom = document.getElementById('cmd')
    dom.scrollTop = dom.scrollHeight // 滚动高度
    dom = null
}

const present = computed(() => store.state.present)
const cmd_count = computed(() => store.state.count)

watch(cmd_count, ()=>{
    scrollBottom()
})
const cleanPresent = () => store.commit('cleanPresent')
const cmdClear = () => store.commit('clearList')
const addList = (value) => store.commit('addList', value)
const cmd_list = computed(() => store.state.cmd_list)

const btn_loading = ref<boolean>(false)
const run = async () => {
    cmdClear()
    cleanPresent()
    active.value = 0
    try{
        btn_loading.value = true
        addList('正在编译...')
        active.value++
        // @ts-ignore：无法被执行的代码的错误
        await build(config.value.local_path)
        active.value++
        // @ts-ignore：无法被执行的代码的错误
        await uploadFile(config.value, config.value.local_path)
        active.value++
    }catch(e){
        console.log('发生错误')
    }finally{
        btn_loading.value = false
        active.value = 4
    }


}


</script>
<style lang="scss" module="s">
.wrapper {
    display: flex;
    flex-direction: column;
    padding: 16px;
    width: 100%;


    .top {
        display: flex;
        
        .push_btn {
            margin-left: 12px;
        }
    }

    .info {
        margin-top: 12px;
    }

    .progress {
        margin-top: 32px;
    }
    .cmd {
        background: #0A2A35;
        height: 360px;
        overflow: auto;
        margin-top: 46px;
        border-radius: 12px;
        color:  #dedfe0;
        padding: 12px;
        display: flex;
        flex-direction: column;
        line-height: 1.7;

        span:last-child {
            .arrow {
                  color:  #79bbff;
            }
        }

        .line {
            display: flex;
        }
        .arrow {
            color:  #c8c9cc;
        }
    }

}

</style>
