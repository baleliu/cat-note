import { Rnd } from 'react-rnd';

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
      <Rnd
        style={style}
        default={{
          x: 0,
          y: 0,
          width: 200,
          height: 200,
        }}
      >
        Rnd
      </Rnd>
    </>
  );
};
