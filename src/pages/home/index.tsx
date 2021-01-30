import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { Layout, Tree, Select } from 'antd';
import 'codemirror/lib/codemirror.css';
import React, { FC, useRef, useState } from 'react';
import { connect, ConnectProps, IndexModelState, Loading } from 'umi';

const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    icon: <CarryOutOutlined />,
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
  const [showLine, setShowLine] = useState<boolean | { showLeafIcon: boolean }>(
    true,
  );
  const { name } = index;

  return (
    <Layout className="layout">
      <Sider
        width="300px"
        style={{
          background: 'rgba(255, 255, 255, 0.3)',
          border: '1px solid black',
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
        <Tree
          defaultExpandedKeys={['0-0-0-0']}
          treeData={treeData}
          showIcon={true}
        />
      </Sider>
      <Content
        style={{
          padding: '0 50px',
          height: '100vh',
        }}
      >
        {/* todo 编辑器头
        <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> */}
        <div className="site-layout-content">
          <Editor
            initialValue={name}
            previewStyle="vertical"
            height="100vh"
            initialEditType="markdown"
            ref={ref}
            useCommandShortcut={true}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default connect(
  ({ index, loading }: { index: IndexModelState; loading: Loading }) => ({
    index,
    loading: loading.models.index,
  }),
)(IndexPage);
