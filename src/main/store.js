import Store from 'electron-store';
import { app } from 'electron';

// 初始化渲染进程存储器
Store.initRenderer();

console.log(`Store存储路径${app.getPath('userData')}`);
