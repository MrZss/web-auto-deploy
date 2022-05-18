//* 依赖引入
import { BrowserWindow } from 'electron'
import { join } from 'path' //* 路径
import { setContextMenu } from "./setContextMenu";
import { getUrl } from '../utils/URL'

const winURL = getUrl("", join(__dirname, '..', 'renderer', 'index.html')); //* 获取vue的路径
// const winURL = 'http://localhost:9080/'
class MainInit {
    mainWindow = null
    createMainWindow() {
        //* 创建一个窗口对象
        this.mainWindow = new BrowserWindow({
            titleBarStyle: 'default', //* 设置标题栏样式
            minWidth: 1120,
            minHeight: 900,
            width: 1120, // * 指定启动app时的默认窗口尺寸
            height: 760, // * 指定启动app时的默认窗口尺寸
            // frame: true, // * app边框(包括关闭,全屏,最小化按钮的导航栏) @false: 隐藏
            // transparent: false, // * app 背景透明
            // hasShadow: false, // * app 边框阴影
            // show: false, // 启动窗口时隐藏,直到渲染进程加载完成「ready-to-show 监听事件」 再显示窗口,防止加载时闪烁
            resizable: false, // 是否允许手动修改窗口
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        })
        //* 加载vue页面
        this.mainWindow.loadURL(winURL)
        this.mainWindow.openDevTools();
        setContextMenu(this.mainWindow);
    }
    initWindow() { //* 初始化窗口
        console.log('<===== 要来创建窗口')
        this.createMainWindow()
    }
}

export default MainInit