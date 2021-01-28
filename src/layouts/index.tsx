import { Menu, Input, Layout, Drawer, Button, Avatar } from 'antd';
import React, { useRef, useState } from 'react';
import {
  UserOutlined,
  PieChartOutlined,
  FileOutlined,
  DownCircleOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import './style.less';
import {
  connect,
  GlobalLayoutModelState,
  IRouteComponentProps,
  Loading,
} from 'umi';

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;
const { SubMenu } = Menu;

const GlobalLayout = ({
  children,
  location,
  route,
  history,
  match,
  globalLayout,
  dispatch,
}: IRouteComponentProps) => {
  console.log(globalLayout);

  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const inputRef: any = useRef();
  return (
    <>
      <Drawer
        placement="top"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <div style={{ marginTop: '50px' }} />
        <Button
          style={{
            border: '1px solid black',
          }}
          onClick={() => {
            dispatch({
              type: 'globalLayout/load',
              payload: 'http://localhost:8000/#/home',
            });
          }}
          type="link"
        >
          http://localhost:8000/#/home
        </Button>
      </Drawer>
      <Layout>
        <Sider className="navSider" width="66px" theme="light" collapsed={true}>
          <Avatar
            style={{
              backgroundColor: '#87d068',
              marginLeft: '16px',
              marginRight: '16px',
              marginTop: '50px',
              marginBottom: '20px',
            }}
            icon={<UserOutlined />}
          />
          <Menu defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item
              key="1"
              onClick={showDrawer}
              icon={<DownCircleOutlined />}
            >
              应用菜单
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              todo
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout
          style={{
            marginLeft: '66px',
          }}
        >
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </>
  );
};

export default connect(
  ({ globalLayout }: { globalLayout: GlobalLayoutModelState }) => {
    return {
      globalLayout,
    };
  },
)(GlobalLayout);

// export default GlobalLayout;
