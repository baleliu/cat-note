'use strict';

const { contextBridge } = require('electron');
const FileController = require('./api/FileController');
const StoreController = require('./api/StoreController');
const MainController = require('./api/MainController');

contextBridge.exposeInMainWorld('api', {
  forward: MainController.forward,
  settingMenu: MainController.settingMenu,
  file: FileController.file,
  db: StoreController.db,
});

window.addEventListener('DOMContentLoaded', () => {
  // const replaceText = (selector, text) => {
  //   const element = document.getElementById(selector);
  //   if (element) element.innerText = text;
  // };
  // for (const type of ['chrome', 'node', 'electron']) {
  //   replaceText(`${type}-version`, process.versions[type]);
  // }
  // console.log('dom加载完成');
});

window.addEventListener('drop', (e) => {
  e.preventDefault();
  //获取文件列表
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    //获取文件路径
    const path = files[0].path;
    console.log('path:', path);
    //读取文件内容
    console.log(content.toString());
  }
});
