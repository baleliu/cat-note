// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require('electron');
const FileService = require('./service/FileService');
const Store = require('electron-store');
const store = new Store();

store.set('liu', 'wentao');
console.log(store.get('liu'));
// import { contextBridge } from 'electron'

// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type])
//   }
// })

contextBridge.exposeInMainWorld('api', {
  file: FileService.file,
  openDevTools: () => {
    ipcRenderer.send('open-dev-tools');
  },
  db: {
    get: (k) => {
      return ipcRenderer.sendSync('db-get', k);
    },
    set: (k, v) => {
      ipcRenderer.send('db-set', {
        key: k,
        value: v,
      });
    },
  },
});
