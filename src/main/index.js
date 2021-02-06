'use strict';

const { app, BrowserWindow, ipcMain, Menu } = require('electron');
import * as path from 'path';
import './store';
import { settingMenu } from './menu';
import { format } from 'url';
import os from 'os';
import fs from 'fs';

// 操作系统类型
console.log(os.type());
const isMac = process.platform === 'darwin';
const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
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
    window.loadURL(`http://localhost:8000/#/editor`);
    // window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
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

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
  mainWindow.webContents.openDevTools({ mode: 'detach' });
});

ipcMain.on('forward', (event, arg) => {
  mainWindow.loadURL(arg);
});

Menu.setApplicationMenu(settingMenu);
ipcMain.on('setting-menu', () => {
  settingMenu.popup({
    window: mainWindow,
  });
});

ipcMain.on('write-file', (event, arg) => {
  let dir = path.join(app.getPath('userData'), arg.tag ? arg.tag : 'default');
  try {
    let stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
      fs.mkdirSync(dir);
    }
  } catch (e) {
    fs.mkdirSync(dir);
  }
  fs.writeFile(path.join(dir, arg.fileKey), arg.data, (err) => {
    if (err) throw err;
    console.log('文件已被保存');
  });
});

ipcMain.on('read-file', (event, arg) => {
  try {
    event.returnValue = fs.readFileSync(
      path.join(
        path.join(app.getPath('userData'), arg.tag ? arg.tag : 'default'),
        arg.fileKey,
      ),
      'utf8',
    );
  } catch (e) {
    console.log(e);
    event.returnValue = '';
  }
});
