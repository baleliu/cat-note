# 渲染进程

## 使用 Store

```
const Store = window.require('electron-store');
const store = new Store();


store.set('unicorn', '🦄');
console.log(store.get('unicorn'));
```