import { Menu, ipcMain, BrowserWindow, app } from "electron";
// getmenu接口

export function getfocusWindow() {
	return BrowserWindow.getFocusedWindow();
}

export function openDevTools() {
	getfocusWindow()?.webContents.openDevTools();
}
/**
 * 自定义顶部menu会导致默认的几个菜单消失 (如view,window等..)
 * 如需添加,设置sunmenu[x].role = xxx 即可
 * 详情参考https://www.electronjs.org/zh/docs/latest/api/menu#示例
 */

/**
 * app加载完成时添加ipc通讯监听:
 * 当渲染进程发来索取app顶部菜单请求时,返回菜单数组用于生成windows上左上角菜单栏
 * 当渲染进程自定义菜单项被点击时,通过传入的menuItemId获取对应的菜单项,并调用click事件
 */
export function onAppMenu() {
  // 渲染进程索取菜单时,如果是windows,返回菜单,如果是macos,返回null
    ipcMain.handle("getAppMenu", () =>
      	process.platform == "darwin" ? null : getmenu()
    );
    // ipcMain.handle("getAppMenu", (): menuObj[] | null => getmenu());
    ipcMain.on("MenuClick", (event, menuItemId) => {
		const menuItem = Menu.getApplicationMenu()?.getMenuItemById(menuItemId);
		menuItem?.click();
    });
}

/**
 * @description 创建app菜单
 */
export function createAppMenu() {
  	const AppMenu = [
    // 在mac上,第一个自定义menuItem的label会被应用名覆盖
    //此label会被package.json打包配置中的 `build.productName = ‘后台管理’` 覆盖
    	{
     		id: "1",
      		label: "开发",
      		submenu: [
        		{
					id: "1-1",
					label: "检查元素",
					click() {
						openDevTools();
					}
       			}
     		]
   		},
		{
			label: '编辑',
			submenu: [
				{ label: '剪切', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
				{ label: '复制', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
				{ label: '粘贴', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
				{ label: '全选', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
			]
		}
  	];
	/** 创建菜单 */
	const appMenu = Menu.buildFromTemplate(AppMenu);
	return appMenu;
}

/**
 * @description 递归生成菜单数组,数组传递给渲染进程用于生成windows上左上角菜单栏
 *
 */
function getmenu() {
	function menu(ims) {
		let menuAr = [];
		ims.map((im) => {
			let menuObj = {
				lable: im.label,
				id: im.id,
				type: im.type,
				child: im.type == "submenu" && im.submenu ? menu(im.submenu.items) : null
			};
			menuArr.push(menuObj);
		});
		return menuArr;
	}
	const ims = Menu.getApplicationMenu()
	return menu(ims.items);
}
