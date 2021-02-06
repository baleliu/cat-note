'use strict';

const { app, BrowserWindow, ipcMain, Menu } = require('electron');

const template = [
  {
    label: '查看(view)',
    submenu: [
      { role: 'reload', label: '刷新' },
      { role: 'forceReload', label: '强制刷新' },
      { type: 'separator' },
      { role: 'toggleDevTools', label: '控制台' },
      { type: 'separator' },
      { role: 'resetZoom', label: '重制大小' },
      { role: 'zoomIn', label: '放大' },
      { role: 'zoomOut', label: '缩小' },
    ],
  },
  {
    role: 'help',
    label: '帮助(help)',
    submenu: [
      {
        label: '官网(electron)',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://electronjs.org');
        },
      },
    ],
  },
];

export const settingMenu = Menu.buildFromTemplate(template);
