import fs from 'fs';
import * as path from 'path';
const { app, ipcMain } = require('electron');
const log = require('electron-log');

const finalPath = (arg) => {
  let dir = path.join(app.getPath('userData'), arg.tag ? arg.tag : 'default');
  dir = path.join(dir, arg.fileKey);
  fs.mkdirSync(dir, { recursive: true });
  const suffix = arg.suffix ? arg.suffix : '';
  return path.join(dir, `index${suffix}`);
};

ipcMain.on('write-file', (event, arg) => {
  let fp = finalPath(arg);
  log.info(`write-file ${fp}`);
  fs.writeFile(fp, arg.data, (err) => {
    if (err) throw err;
    let callback = arg.callback;
    if (callback) {
      callback();
    }
    log.info(`文件已被保存 [${fp}]`);
  });
});

ipcMain.on('write-file-sync', (event, arg) => {
  log.info(`write-file-sync`);
  fs.writeFileSync(finalPath(arg), arg.data);
  event.returnValue = 'ok';
});

ipcMain.on('read-file-sync', (event, arg) => {
  try {
    const encoding = arg.encoding ? arg.encoding : 'utf8';
    const fp = finalPath(arg);
    log.info(`read-file-sync ${fp}`);
    event.returnValue = fs.readFileSync(fp, encoding);
  } catch (e) {
    console.log(e);
    event.returnValue = '';
  }
});
