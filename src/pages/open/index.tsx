import React from 'react';

import { Button } from 'antd';

import Example from './example';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default () => {
  return (
    <>
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
      <DndProvider backend={HTML5Backend}>
        <Example />
      </DndProvider>
    </>
  );
};
