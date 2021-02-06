'use strict';

import Store from 'electron-store';
import { app, ipcMain } from 'electron';
const store = new Store();

console.log(`Store存储路径${app.getPath('userData')}`);

ipcMain.on('db-set', (event, arg) => {
  store.set(arg.key, arg.value);
});

ipcMain.on('db-get', (event, arg) => {
  let value = store.get(arg);
  event.returnValue = value;
});
