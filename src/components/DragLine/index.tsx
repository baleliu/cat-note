import { DragEventHandler } from 'react';
import { Rnd } from 'react-rnd';
import './style.less';

interface DragLineProps {
  boundStart: number;
  boundWidth: string;
  children?: any;
  onDrag?: (x: number) => void;
}

export default (prop: DragLineProps) => {
  return (
    <>
      <div
        className="drag-line-parent"
        style={{
          marginLeft: prop.boundStart + 'px',
          width: prop.boundWidth,
        }}
      >
        <Rnd
          className="drag-line"
          enableResizing={false}
          dragAxis="x"
          onDragStop={(e, data) => {
            if (prop.onDrag) {
              prop.onDrag(data.x);
            }
          }}
          default={{
            x: 0,
            y: 0,
            width: 1,
            height: '100vh',
          }}
          bounds="parent"
        ></Rnd>
      </div>
    </>
  );
};
