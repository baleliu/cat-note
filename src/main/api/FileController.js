const { ipcRenderer } = require('electron');

exports.file = {
  readFileSync: (options) => {
    return ipcRenderer.sendSync('read-file-sync', options);
  },
  writeFileSync: (options) => {
    return ipcRenderer.sendSync('write-file-sync', options);
  },
  writeFile: (options) => {
    ipcRenderer.send('write-file', options);
  },
};
