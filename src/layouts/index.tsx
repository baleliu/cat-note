import Logo from '@/components/Logo';
import SettingBtn from '@/components/SettingBtn';
import Icon, {
  BookOutlined,
  CarryOutOutlined,
  CodeSandboxOutlined,
  EditOutlined,
  DownCircleOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Drawer, Input, Layout, Menu } from 'antd';
import React, { useRef, useState } from 'react';
import { connect, GlobalModelState, IRouteComponentProps } from 'umi';
import './style.less';
const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

interface GlobalLayoutProps extends IRouteComponentProps {
  children: any;
  history: any;
  globalModel: GlobalModelState;
  dispatch: any;
}

const iconSwitch = (code: string) => {
  switch (code) {
    case 'BookOutlined':
      return <BookOutlined />;
    case 'EditOutlined':
      return <EditOutlined />;
    default:
      return <CodeSandboxOutlined />;
  }
};

const GlobalLayout = ({
  children,
  history,
  globalModel,
  dispatch,
}: GlobalLayoutProps) => {
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
              type: 'globalModel/load',
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
              type: 'globalModel/load',
              payload: value,
            });
          }}
        />
      </Drawer>
      <Layout className="layout-container">
        <Layout>
          <Sider className="nav-sider" theme="light" collapsed={true}>
            <div className="setting-container">
              <SettingBtn
                onClick={() => {
                  dispatch({
                    type: 'globalModel/settingMenu',
                  });
                }}
              />
            </div>
            <Avatar
              className="nav-sider-logo"
              size="large"
              shape="square"
              icon={<Icon component={Logo} />}
            />
            <Menu defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item
                key="1"
                onClick={showDrawer}
                icon={<DownCircleOutlined />}
              >
                应用菜单
              </Menu.Item>
              {globalModel.bars.map((o) => {
                return (
                  <Menu.Item
                    key={o.id}
                    onClick={() => {
                      history.push(o.route);
                    }}
                    icon={iconSwitch(o.icon)}
                  >
                    {o.name}
                  </Menu.Item>
                );
              })}
            </Menu>
          </Sider>
          <Layout
            style={{
              marginLeft: '66px',
            }}
          >
            <Content>{children}</Content>
            <Footer className="global-footer">todo 这里做数据展示</Footer>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default connect(({ globalModel }: { globalModel: GlobalModelState }) => {
  return {
    globalModel,
  };
})(GlobalLayout);
