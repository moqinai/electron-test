/*
 * @Author: lipengcheng
 * @Date: 2023-10-16 15:09:56
 * @LastEditTime: 2023-10-16 17:36:47
 * @Description: 
 */
//src\main\mainEntry.ts
import { app, BrowserWindow } from "electron"
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true" // 用于设置渲染进程开发者调试工具的警告，这里设置为 true 就不会再显示任何警告了。

let mainWindow: BrowserWindow;
// 创建了一个简单的 BrowserWindow 对象
// app 是 Electron 的全局对象，用于控制整个应用程序的生命周期。
// 在 Electron 初始化完成后，app 对象的 ready 事件被触发，这里我们使用 app.whenReady() 这个 Promise 方法来等待 ready 事件的发生。

app.whenReady().then(() => {
  let config = {
    webPreferences: {
      nodeIntegration: true, // 把 Node.js 环境集成到渲染进程中，contextIsolation
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
    },
  };
  mainWindow = new BrowserWindow(config)
  mainWindow.webContents.openDevTools({ mode: "undocked" }) // 用于打开开发者调试工具
  mainWindow.loadURL(process.argv[2]);
});