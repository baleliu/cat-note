import { SettingFilled } from '@ant-design/icons';
import { Avatar, Button, Drawer, Input, Layout, Menu } from 'antd';
import React, { useRef, useState } from 'react';

import './style.less';

export default (props: { onClick: () => void }) => {
  const [spin, setSpin] = useState(false);
  return (
    <div
      onClick={props.onClick}
      onMouseEnter={() => {
        setSpin(true);
      }}
      onMouseLeave={() => {
        setSpin(false);
      }}
    >
      <Avatar className="setting-icon" icon={<SettingFilled spin={spin} />} />
    </div>
  );
};
