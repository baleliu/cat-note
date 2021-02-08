const { ipcRenderer } = require('electron');

exports.db = {
  /**
   * 获取值
   * @param {*} k key
   * @param {*} schema 数据库
   */
  get: (k, schema) => {
    return ipcRenderer.sendSync('db-get', {
      key: k,
      schema: schema,
    });
  },
  /**
   * 存储
   * @param {*} k  key
   * @param {*} v  value
   * @param {*} schema  数据库
   */
  set: (k, v, schema) => {
    ipcRenderer.send('db-set', {
      key: k,
      value: v,
      schema: schema,
    });
  },
};
