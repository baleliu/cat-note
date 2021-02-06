import { DragEventHandler, useState } from 'react';
import { Rnd } from 'react-rnd';
import './style.less';

interface DragLineProps {
  boundStart: number;
  boundWidth: string;
  children?: any;
  zIndex?: number;
  height: string;
  onDrag?: (x: number) => void;
  onDragStart?: () => void;
}

export default (prop: DragLineProps) => {
  return (
    <>
      <div
        className="drag-line-parent"
        style={{
          marginLeft: prop.boundStart + 'px',
          width: prop.boundWidth,
          height: prop.height,
          // zIndex: prop.zIndex,
        }}
      >
        <Rnd
          className="drag-line"
          enableResizing={false}
          // style ={{
          //   border: '1px solid black'
          // }}
          dragAxis="x"
          onDragStop={(e, data) => {
            prop.onDrag && prop.onDrag(data.x);
          }}
          onDragStart={() => {
            prop.onDragStart && prop.onDragStart();
          }}
          default={{
            x: 0,
            y: 0,
            width: 2,
            height: '100%',
          }}
          bounds="parent"
        ></Rnd>
      </div>
    </>
  );
};
