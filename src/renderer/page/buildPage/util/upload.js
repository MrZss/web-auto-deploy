const Ssh = window.require('ssh2');
const sshClient = new Ssh.Client();
import store from '../store.js'
import { h } from 'vue'

const deployProject = (res,sshClient) => {
    return new Promise((resolve, reject) => {
        store.commit('addList',`正在解压ing`)
        const { target_path, run, password } = res.server
        sshClient.shell((err, stream) => {
            stream
            .end(
            `
                cd ${target_path}
                tar zxvf assets.tar.gz
                exit
            `
            )
            .on('data', (data) => {
                // 输出部署时的信息
                if(data.toString().indexOf('password:')>=0){
                    stream.end(
                        `
                            ${password}
                            
                        `
                    )
                }
                if(data.toString().indexOf('replace')>=0 || data.toString().indexOf('覆盖')>=0){
                    stream.end(
                        `
                            y
                            
                        `
                    )
                }
                console.log('正在传输： ', data.toString());
            })
            .on('close', () => {
                store.commit('addList',`解压完毕`)
                sshClient.end();
                resolve()
                store.commit('addList',`部署完成`)
            });
        });
    })
}

const upload = (res,local_path) => {
    return new Promise((resolve,reject)=>{
        const {server: { target_path, host, username, password } } = res
        store.commit('addList','上传文件')
        store.commit('addList',`本地地址：${local_path}`)
        store.commit('addList',`目标地址：${target_path}`)
        sshClient
        .on('ready', () => {
              sshClient.sftp((err, sftp) => {
                  sftp.fastPut(
                      `${local_path}/dist/assets.tar.gz`, // 本地 assets.tar.gz 文件路径
                      `${target_path}/assets.tar.gz`, // 服务器 assets.tar.gz 文件路径
                      {step: (total_transferred, chunk, total) => {
                        //每小段上传完成后的回调
                        const pre = total_transferred/total
                        console.log(`传输进度：${pre}%`)
                      }},
                  (err, result) => {
                      console.log('触发一次')
                      store.commit('addList','传输完成')
                      resolve()
                  }
              );
          });
      })
      .connect({
          host,
          port: 22,  // 服务器 port
          username,
          password
      });
    })
}

const uploadFile = async (res,local_path) => {
    await upload(res,local_path)
    await deployProject(res,sshClient);
}

export default uploadFile