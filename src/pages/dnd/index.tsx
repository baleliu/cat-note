import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Example from './example';

export default () => {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Example />
      </DndProvider>
    </>
  );
};
