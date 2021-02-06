'use strict';

const { contextBridge, ipcRenderer, remote } = require('electron');
const FileService = require('./api/FileController');

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
    ipcRenderer.send('forward', url);
  },
  settingMenu: () => {
    ipcRenderer.send('setting-menu');
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
