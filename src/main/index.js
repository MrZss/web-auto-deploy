//* 依赖引入
import { app, BrowserWindow, Menu } from 'electron'
import InitWindow from './services/windowManager'
import { createAppMenu } from './services/menu'

const Store = require('electron-store');
Store.initRenderer();
//* 监听启动完成事件 则打开窗口
function onAppReady() { //* App准备完成事件
    new InitWindow().initWindow()
}
console.log('设置')
app.on("ready", () => {
    // 设置app菜单
    Menu.setApplicationMenu(createAppMenu());
    onAppReady(); // 创建窗口
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他打开的窗口，那么程序会重新创建一个窗口。
    app.on("activate", () => BrowserWindow.getAllWindows().length === 0 && onAppReady() );
});

app.on('window-all-closed', () => {
    // 所有平台均为所有窗口关闭就退出软件
    app.quit()
})