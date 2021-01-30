import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Example from './example';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default () => {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Example />
      </DndProvider>
    </>
  );
};
