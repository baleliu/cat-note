import { Input } from 'antd';
import React from 'react';
import './style.less';

export default (props: {
  key: string;
  title?: string;
  onBlur?: (e: any) => void;
  onChange?: (e: any) => void;
}) => {
  return (
    <Input
      className="tui-editor-title"
      bordered={false}
      defaultValue={props.title}
      size="large"
      style={{
        fontSize: '30px',
        lineHeight: '60px',
        padding: '0 0',
      }}
      onBlur={props.onBlur}
      onChange={props.onChange}
    />
  );
};
