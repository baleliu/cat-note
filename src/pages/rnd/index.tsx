import { Rnd } from 'react-rnd';
import DragLine from '@/components/DragLine';

export default () => {
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 1px #ddd',
    background: '#f0f0f0',
  } as const;
  return (
    <>
      <DragLine
        boundStart={10}
        onDrag={(e: any) => {
          console.log(e);
        }}
        boundWidth="100px"
      />
      {/* <Rnd
        style={style}
        default={{
          x: 0,
          y: 0,
          width: 200,
          height: 200,
        }}
      >
        Rnd
      </Rnd> */}
    </>
  );
};
