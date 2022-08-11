const { NodeSSH } = require('node-ssh')
const ssh = new NodeSSH()

const backupRemoteFile = async (config, index) => {
    try {
        const { webDir, bakDir } = config
        const dirName = webDir.split('/')[webDir.split('/').length - 1]
        const zipFileName = `${dirName}_${dayjs().format(
            'YYYY-MM-DD_HH:mm:ss'
        )}.zip`
  
        //   log(`(${index}) 备份远程文件 ${underline(webDir)}`)
  
        await ssh.execCommand(`[ ! -d ${bakDir} ] && mkdir ${bakDir}`)
    
        await ssh.execCommand(`zip -q -r ${bakDir}/${zipFileName} ${webDir}`)
    
        succeed(`备份成功 备份至 ${underline(`${bakDir}/${zipFileName}`)}`)
    } catch (e) {
        error(e)
        process.exit(1)
    }
}

export default backupRemoteFile