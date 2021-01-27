import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { Layout } from 'antd';
import 'codemirror/lib/codemirror.css';
import React, { useRef, useState } from 'react';
import { Tree, Switch } from 'antd';
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

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

export default function IndexPage() {
  const ref: any = useRef(null);
  const [showLine, setShowLine] = useState<boolean | { showLeafIcon: boolean }>(
    true,
  );

  return (
    <Layout className="layout">
      <Sider
        width="300px"
        style={{
          background: 'rgba(255, 255, 255, 0.3)',
          border: '1px solid black',
        }}
      >
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
            initialValue="hello react editor world!"
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
}
