import Store from 'electron-store';
import { app } from 'electron';

console.log(`Store存储路径${app.getPath('userData')}`);
