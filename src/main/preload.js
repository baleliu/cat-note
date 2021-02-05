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
//     const element = document.getElementById(selector);
//     if (element) element.innerText = text;
//   };

//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type]);
//   }

//   const links = document.querySelectorAll('a[href]');
//   links.forEach((link) => {
//     link.addEventListener('click', (e) => {
//       const url = link.getAttribute('href');
//       console.log(url);
//       e.preventDefault();
//       // shell.openExternal(url);
//     });
//   });
// });

contextBridge.exposeInMainWorld('api', {
  file: FileService.file,
  forward: (url) => {
    console.log(url);
    ipcRenderer.send('forward', url);
  },
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
