const fs = require('fs');
const { ipcRenderer } = require('electron');

exports.file = {
  readFileSync: (fileKey, tag) => {
    return ipcRenderer.sendSync('read-file', {
      fileKey: fileKey,
      tag: tag,
    });
  },
  writeFile: (options) => {
    ipcRenderer.send('write-file', options);
  },
};
