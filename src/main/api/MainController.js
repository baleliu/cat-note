const { ipcRenderer } = require('electron');

exports.forward = (url) => {
  ipcRenderer.send('forward', url);
};

exports.settingMenu = () => {
  ipcRenderer.send('setting-menu');
};
