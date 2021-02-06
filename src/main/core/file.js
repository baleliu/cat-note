import fs from 'fs';
const { app, ipcMain } = require('electron');

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
