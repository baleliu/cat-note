import DragLine from '@/components/DragLine';
import {
  CarryOutOutlined,
  FormOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { Input, Layout, Select, Tree } from 'antd';
import 'codemirror/lib/codemirror.css';
import React, { FC, useRef, useState } from 'react';
import { connect, ConnectProps, IndexModelState, Loading } from 'umi';
import './style.less';

const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;

const x = (name: string) => {
  switch (name) {
    case 'CarryOutOutlined':
      return <CarryOutOutlined />;
  }
};

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    icon: x('CarryOutOutlined'),
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        icon: <CarryOutOutlined />,
        children: [
          { title: 'leaf', key: '0-0-0-0', icon: <CarryOutOutlined /> },
          {
            title: (
              <>
                <div>multiple line title</div>
                <div>multiple line title</div>
              </>
            ),
            key: '0-0-0-1',
            icon: <CarryOutOutlined />,
          },
          { title: 'leaf', key: '0-0-0-2', icon: <CarryOutOutlined /> },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        icon: <CarryOutOutlined />,
        children: [
          { title: 'leaf', key: '0-0-1-0', icon: <CarryOutOutlined /> },
        ],
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        icon: <CarryOutOutlined />,
        children: [
          { title: 'leaf', key: '0-0-2-0', icon: <CarryOutOutlined /> },
          {
            title: 'leaf',
            key: '0-0-2-1',
            icon: <CarryOutOutlined />,
            switcherIcon: <FormOutlined />,
          },
        ],
      },
    ],
  },
  {
    title: 'parent 2',
    key: '0-1',
    icon: <CarryOutOutlined />,
    children: [
      {
        title: 'parent 2-0',
        key: '0-1-0',
        icon: <CarryOutOutlined />,
        children: [
          { title: 'leaf', key: '0-1-0-0', icon: <CarryOutOutlined /> },
          { title: 'leaf', key: '0-1-0-1', icon: <CarryOutOutlined /> },
        ],
      },
    ],
  },
];

interface PageProps extends ConnectProps {
  index: IndexModelState;
  loading: boolean;
}

const IndexPage: FC<PageProps> = ({ index, dispatch }) => {
  const ref: any = useRef(null);
  const categoryRef: any = useRef();
  const [showSiderWidth, setShowSiderWidth] = useState<{
    siderWidth: string;
  }>({
    siderWidth: '300px',
  });
  const { name } = index;
  return (
    <Layout className="layout">
      <DragLine
        boundStart={300}
        onDrag={(x: number) => {
          console.log(x);
          setShowSiderWidth({
            siderWidth: 300 + x + 'px',
          });
        }}
        boundWidth="200px"
      ></DragLine>
      <Sider
        width={showSiderWidth.siderWidth}
        style={{
          background: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Select a person"
          optionFilterProp="children"
        >
          <Option value="kb01">知识库01</Option>
          <Option value="kb02">知识库02</Option>
          <Option value="kb03">知识库03</Option>
        </Select>
        <div
          style={{
            height: '70px',
            padding: '0 0',
            margin: '0 0',
          }}
        >
          <PlusSquareOutlined
            style={{
              fontSize: '50px',
              marginTop: '10px',
              marginBottom: '10px',
              width: '100%',
            }}
          />
        </div>
        <Tree
          draggable={true}
          defaultExpandedKeys={['0-0-0-0']}
          treeData={treeData}
          showIcon={true}
        />
      </Sider>
      <Layout>
        <Header className="editor-title">
          <Input
            placeholder="请输入标题"
            bordered={false}
            size="large"
            style={{
              fontSize: '30px',
              lineHeight: '60px',
              padding: '0 0',
            }}
          />
        </Header>
        <Content
          style={{
            padding: '0 0px',
            height: 'calc(100vh - 60px)',
          }}
        >
          <Editor
            initialValue={name}
            previewStyle="vertical"
            height="calc(100vh - 60px)"
            initialEditType="markdown"
            ref={ref}
            useCommandShortcut={false}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default connect(
  ({ index, loading }: { index: IndexModelState; loading: Loading }) => ({
    index,
    loading: loading.models.index,
  }),
)(IndexPage);
