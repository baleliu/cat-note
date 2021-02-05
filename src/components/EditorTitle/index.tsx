import TuiEditor from '@/components/TuiEditor';
import React, { useRef } from 'react';
import { Input } from 'antd';

export default (props: {
  key: string;
  title?: string;
  onBlur?: (e: any) => void;
  onChange?: (e: any) => void;
}) => {
  return (
    <Input
      placeholder="请输入标题"
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
