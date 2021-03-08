'use strict';

import { app, ipcMain } from 'electron';
import Store from 'electron-store';
const log = require('electron-log');

const storeMap = new Map([['default', new Store()]]);

console.log(`Store存储路径${app.getPath('userData')}`);

const initStore = (schema) => {
  if (!storeMap.has(schema)) {
    storeMap.set(
      schema,
      new Store({
        name: schema,
      }),
    );
  }
};

ipcMain.on('db-set', (event, arg) => {
  const schema = arg.schema;
  log.info('db-set: ' + JSON.stringify(arg));
  if (!schema) {
    storeMap.get('default').set(arg.key, arg.value);
  } else {
    initStore(schema);
    storeMap.get(schema).set(arg.key, arg.value);
  }
});

ipcMain.on('db-get', (event, arg) => {
  log.info('db-get: ' + JSON.stringify(arg));
  const schema = arg.schema;
  let value;
  if (!schema) {
    value = storeMap.get('default').get(arg.key);
  } else {
    initStore(schema);
    value = storeMap.get(schema).get(arg.key);
  }
  event.returnValue = value;
});
