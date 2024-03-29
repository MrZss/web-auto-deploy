import { Ls } from 'dayjs'
import store from '../store.js'
const { spawn } = window.require('child_process')

const actionCommand = (targetDir, msg) => {
    return new Promise((resolve, reject)=>{
        let present = 0
        if (msg === '') return
        console.log('spawn',spawn)
        const ls = spawn(msg, {
            encoding: 'utf8',
            env: {
                PATH: '/bin:/usr/bin:/usr/local/bin',
                PORT: 4545,
            },
            cwd: targetDir, // 执行命令路径
            shell: true, // 使用shell命令
        })
        ls.stderr.on('data', (data)=>{
            let value = data.toString().trim()
            console.log(value)
            if(value.indexOf('%') > 0){
                value = value.match(/([(0-9)|\s][0-9])%/)[1]
                present = Number(value) > present ? Number(value) : present
                console.log(`正则构建：build进度- ${present}%`)
                store.commit('addPresent',present )
            }
        })
        ls.stdout.on('data', data => {
            console.log(`stdout: ${data}`)
          })
        ls.on('error', code => {
            console.log(`子进程错误，错误码 ${code}`)
            // downLiveServer()
        })          
        ls.on('close', (data)=> {
            console.log('close',data.toString())
            store.commit('addPresent', 100 )
            store.commit('addList', '已生成dist包并压缩' )
            resolve()
        })
    })
}

const build = async(targetDir) => {
        console.log('targetDir11',targetDir)
        const msg = 'sudo yarn run build:test && cd ./dist/ && tar zcvf assets.tar.gz *'
        await actionCommand(
            targetDir,
            msg
        )
        
        console.log(store.state.cmd_list)
}

export default build