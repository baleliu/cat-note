import {
  DesktopOutlined,
  DownCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Drawer, Input, Layout, Menu } from 'antd';
import React, { useRef, useState } from 'react';
import { connect, GlobalLayoutModelState, IRouteComponentProps } from 'umi';
import './style.less';
const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;
const { SubMenu } = Menu;
import { getDvaApp } from 'umi';

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
              payload: 'http://localhost:8000/#/editor',
            });
          }}
          type="link"
        >
          http://localhost:8000/#/editor
        </Button>
        <hr />
        <Input
          ref={inputRef}
          defaultValue="http://localhost:8000/#/"
          onPressEnter={() => {
            const { value } = inputRef.current.state;
            dispatch({
              type: 'globalLayout/load',
              payload: value,
            });
          }}
        />
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
            <Menu.Item
              key="2"
              onClick={() => {
                dispatch({
                  type: 'globalLayout/openDevTools',
                });
              }}
              icon={<DesktopOutlined />}
            >
              打开控制台
            </Menu.Item>
            <Menu.Item
              key="3"
              onClick={() => {
                alert('todo 创建知识库');
              }}
              icon={<DesktopOutlined />}
            >
              创建知识库
            </Menu.Item>
            <Menu.Item
              key="4"
              onClick={() => {
                alert('todo 设置');
              }}
              icon={<DesktopOutlined />}
            >
              设置
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
