import React from 'react';

import { Button } from 'antd';

const electron = window.require('electron');

const ipcRenderer = electron.ipcRenderer;

export default () => {
  return (
    <Button
      onClick={() => {
        console.log(ipcRenderer);
        ipcRenderer.send(
          'asynchronous-message',
          'http://localhost:8000/#/home',
        );
      }}
      type="primary"
    >
      open
    </Button>
  );
};
