const { ipcRenderer } = require('electron');

exports.db = {
  get: (k) => {
    return ipcRenderer.sendSync('db-get', k);
  },
  set: (k, v) => {
    ipcRenderer.send('db-set', {
      key: k,
      value: v,
    });
  },
};
