import { Input, Layout } from 'antd';
import React, { useRef } from 'react';
import {
  connect,
  GlobalLayoutModelState,
  IRouteComponentProps,
  Loading,
} from 'umi';

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

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
  const inputRef: any = useRef();
  return (
    <Layout>
      <Header>
        <Input
          placeholder="输入在线应用页面"
          ref={inputRef}
          defaultValue={'http://localhost:8000/#/home'}
          onPressEnter={(e) => {
            const { value } = inputRef.current.state;
            dispatch({
              type: 'globalLayout/load',
              payload: value,
            });
          }}
        />
      </Header>
      <Content>{children}</Content>
    </Layout>
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
