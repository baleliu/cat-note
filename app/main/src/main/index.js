'use strict';

const { app, BrowserWindow, ipcMain, Menu } = require('electron');
import * as path from 'path';
import './service/store';
import './service/file';
import { settingMenu } from './service/menu';
import { format } from 'url';
import os from 'os';

const log = require('electron-log');
log.transports.console.format =
  '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

// 操作系统类型
console.log(os.type());
const isMac = process.platform === 'darwin';
const isDevelopment = process.env.NODE_ENV !== 'production';

/// 注册 菜单 会导致部分快捷键失效
// Menu.setApplicationMenu(settingMenu);
let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      // path.join(__dirname, "preload.js") 为相对路径, preload 需要转绝对路径
      preload: path.resolve(path.join(__dirname, 'preload.js')),
    },
  });

  if (isDevelopment) {
    // window.loadURL(`http://localhost:8000/#/note/editor`);
    // window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    window.loadURL(
      format({
        pathname: path.join(
          path.join(app.getPath('userData'), 'renderer'),
          'index.html',
        ),
        protocol: 'file',
        slashes: true,
      }),
    );
  } else {
    window.loadURL(
      format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    );
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  // window.open 动作 https://www.electronjs.org/docs/api/web-contents#event-new-window
  window.webContents.on(
    'new-window',
    (
      event,
      url,
      frameName,
      disposition,
      options,
      additionalFeatures,
      referrer,
      postBody,
    ) => {
      event.preventDefault();
      // const win = new BrowserWindow({
      //   webContents: options.webContents, // use existing webContents if provided
      //   show: false
      // })
      // win.once('ready-to-show', () => win.show())
      // if (!options.webContents) {
      //   const loadOptions = {
      //     httpReferrer: referrer
      //   }
      //   if (postBody != null) {
      //     const { data, contentType, boundary } = postBody
      //     loadOptions.postData = postBody.data
      //     loadOptions.extraHeaders = `content-type: ${contentType}; boundary=${boundary}`
      //   }

      //   win.loadURL(url, loadOptions) // existing webContents will be navigated automatically
      // }
      // event.newGuest = win
    },
  );

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  // a标签 动作 https://www.electronjs.org/docs/api/web-contents#event-will-navigate
  window.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    console.log(url);
  });

  // 隐藏窗口的菜单栏
  window.setMenuBarVisibility(false);
  return window;
}

// 窗口关闭
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 窗口激活
app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow();
    if (isDevelopment) {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  }
});

// 窗口加载完成
app.on('ready', () => {
  mainWindow = createMainWindow();
  if (isDevelopment) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
});

ipcMain.on('forward', (event, arg) => {
  mainWindow.loadURL(arg);
});

ipcMain.on('setting-menu', () => {
  settingMenu.popup({
    window: mainWindow,
  });
});
