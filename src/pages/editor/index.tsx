import DragLine from '@/components/DragLine';
import TuiEditor from '@/components/TuiEditor';
import EditorTitle from '@/components/EditorTitle';
import {
  CarryOutOutlined,
  PlusSquareOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { Modal, Layout, Select, Tree, Menu, Dropdown } from 'antd';
import React, { FC, useRef, useState } from 'react';
import { connect, ConnectProps, IndexModelState, Loading } from 'umi';
import './style.less';

const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { confirm } = Modal;

const x = (name: string) => {
  switch (name) {
    case 'CarryOutOutlined':
      return <CarryOutOutlined />;
  }
};

interface PageProps extends ConnectProps {
  editorModel: IndexModelState;
  loading: boolean;
}

const IndexPage: FC<PageProps> = ({ editorModel, dispatch }) => {
  const editorRef: any = React.createRef();
  const categoryRef: any = useRef();
  const [x, setX] = useState<{ value: string }>();
  const [showSiderWidth, setShowSiderWidth] = useState<{
    siderWidth: string;
  }>({
    siderWidth: '200px',
  });
  const addCatalog = (key?: any) => {
    dispatch &&
      dispatch({
        type: 'editorModel/_createCatalog',
        payload: key,
      });
  };
  return (
    <Layout className="layout">
      <DragLine
        boundStart={200}
        onDrag={(x: number) => {
          setShowSiderWidth({
            siderWidth: 200 + x + 'px',
          });
        }}
        height="calc(100vh - 20px)"
        boundWidth="150px"
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
            onClick={() => {
              addCatalog();
            }}
          />
        </div>
        <Tree
          onSelect={(
            selectedKeys,
            { selected: bool, selectedNodes, node, event },
          ) => {
            const { fileKey, key, title } = node as any;
            dispatch &&
              dispatch({
                type: 'editorModel/loadText',
                payload: node,
              });
            setX({
              value: key,
            });
          }}
          titleRender={(node) => {
            return (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      onClick={() => {
                        addCatalog(node.key);
                      }}
                      key="1"
                    >
                      添加子文档
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        confirm({
                          okText: '取消',
                          cancelText: '删除',
                          title: `是否删除文档【${node.title}】`,
                          icon: <ExclamationCircleOutlined />,
                          // content: 'Some descriptions',
                          onCancel() {
                            dispatch &&
                              dispatch({
                                type: 'editorModel/_deleteCatalog',
                                payload: node.key,
                              });
                          },
                        });
                      }}
                      key="2"
                    >
                      删除
                    </Menu.Item>
                  </Menu>
                }
                trigger={['contextMenu']}
              >
                <div style={{ border: '1px solid black' }}>{node.title}</div>
              </Dropdown>
            );
          }}
          onDragEnd={(info) => {
            // console.log(info);
          }}
          onDrop={(info) => {
            console.log(info);
          }}
          draggable={true}
          defaultExpandedKeys={['0-0-0-0']}
          treeData={editorModel.treeData}
          showIcon={true}
        />
      </Sider>
      <Layout>
        <Header className="editor-title">
          <EditorTitle
            key={x ? x.value : ''}
            title={editorModel.currentTitle}
            onChange={(e) => {
              const { value } = e.target;
              dispatch &&
                dispatch({
                  type: 'editorModel/_updateCatalog',
                  payload: {
                    key: editorModel.currentKey,
                    title: value,
                  },
                });
            }}
          />
        </Header>
        <Content
          style={{
            padding: '0 0px',
            marginLeft: '3px',
            height: 'calc(100vh - 80px)',
          }}
        >
          <TuiEditor
            height="calc(100vh - 80px)"
            value={editorModel.currentText}
            key={x ? x.value : ''}
            blur={(text) => {
              dispatch &&
                dispatch({
                  type: 'editorModel/save',
                  payload: text,
                });
            }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default connect(
  ({
    editorModel,
    loading,
  }: {
    editorModel: IndexModelState;
    loading: Loading;
  }) => ({
    editorModel,
    loading: loading.models.index,
  }),
)(IndexPage);
