const { spawn } = window.require('child_process')
const cmd = window.require('node-cmd');
import store from '../store.js'

console.log(store)
const actionCommand = (targetDir, msg) => {
    return new Promise((resolve, reject)=>{
        let present = 0
        if (msg === '') return
        console.log(targetDir)
        const ls = spawn(msg, {
            encoding: 'utf8',
            cwd: targetDir, // 执行命令路径
            shell: true, // 使用shell命令
        })
        ls.stderr.on('data', (data)=>{
            let value = data.toString().trim()
            console.log('value',value)
            if(value.indexOf('%') > 0){
                value = value.match(/([(0-9)|\s][0-9])%/)[1]
                present = Number(value) > present ? Number(value) : present
                console.log(`正则构建：build进度- ${present}%`)
                store.commit('addPresent',present )
            }
        })
        ls.on('close', (data)=> {
            console.log('close',data.toString())
            store.commit('addPresent', 100 )
            console.log('结束包')
            store.commit('addList', '已生成dist包并压缩' )
            resolve()
        })
    })
}

const build = async(targetDir) => {
        console.log('targetDir11',targetDir)
        const msg = 'node -v'
        await actionCommand(
            targetDir,
            msg
        )
        
        console.log(store.state.cmd_list)
}

export default build