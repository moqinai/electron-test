"use strict";

// src/main/mainEntry.ts
var import_electron = require("electron");
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
var mainWindow;
import_electron.app.whenReady().then(() => {
  let config = {
    webPreferences: {
      nodeIntegration: true,
      // 把 Node.js 环境集成到渲染进程中，contextIsolation
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true
    }
  };
  mainWindow = new import_electron.BrowserWindow(config);
  mainWindow.webContents.openDevTools({ mode: "undocked" });
  mainWindow.loadURL(process.argv[2]);
});
