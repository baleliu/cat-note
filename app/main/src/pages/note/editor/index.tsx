import DragLine from '@/components/DragLine';
import EditorTitle from '@/components/EditorTitle';
import TuiEditor, { changeMode, htmlToMarkdown } from '@/components/TuiEditor';
import {
  ExclamationCircleOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { Dropdown, Layout, Menu, Modal, Select, Tree, Empty } from 'antd';
import React, { FC, useRef, useState } from 'react';
import {
  connect,
  ConnectProps,
  IndexModelState,
  KbModelState,
  Loading,
} from 'umi';
import './style.less';
const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { confirm } = Modal;

interface PageProps extends ConnectProps {
  editorModel: IndexModelState;
  kbModel: KbModelState;
  loading: boolean;
}

const getKbFlag = (kbModel: any, key?: string) => {
  if (!key) {
    return false;
  }
  for (let i in kbModel.data) {
    if (kbModel.data[i].id === key) {
      return true;
    }
  }
  return false;
};

const IndexPage: FC<PageProps> = ({ editorModel, kbModel, dispatch }) => {
  const editorRef: any = useRef();
  const categoryRef: any = useRef();
  const [editKey, setEditKey] = useState<string>();
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

  let kbFlag = getKbFlag(kbModel, editorModel.currentKb);
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
          onSelect={(id) => {
            dispatch &&
              dispatch({
                type: 'editorModel/loadCatalog',
                payload: id,
              });
          }}
          defaultValue={kbFlag ? editorModel.currentKb : undefined}
          showSearch
          size="large"
          style={{ width: '100%' }}
          placeholder="Select a person"
          optionFilterProp="children"
        >
          {kbModel.data.map((o) => {
            return (
              <Option key={o.id} value={o.id}>
                {o.name}
              </Option>
            );
          })}
        </Select>
        <div className="catalog-tool-bar">
          <div className="catalog-tool-btn">
            <PlusSquareOutlined
              className="catalog-tool-btn-icon"
              color="gray"
              onClick={() => {
                addCatalog();
              }}
            />
          </div>
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
            setEditKey(key);
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
                          okText: '删除',
                          cancelText: '取消',
                          title: `是否删除文档【${node.title}】`,
                          icon: <ExclamationCircleOutlined />,
                          // content: 'Some descriptions',
                          onOk() {
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
                    {node.key === editorModel.currentKey && (
                      <Menu.Item
                        onClick={() => {
                          let currentNode: any = node;
                          let mode = 'markdown';
                          if (currentNode.editType === 'markdown') {
                            mode = 'wysiwyg';
                          }
                          dispatch &&
                            dispatch({
                              type: 'editorModel/_updateCatalog',
                              payload: {
                                key: currentNode.key,
                                editType: mode,
                              },
                            });
                          if (editorModel.currentKey === node.key) {
                            changeMode(
                              editorRef.current.getInstance(),
                              mode,
                              true,
                            );
                          }
                          console.log(editorRef.current);
                        }}
                        key="3"
                      >
                        切换编辑器模式
                      </Menu.Item>
                    )}
                  </Menu>
                }
                trigger={['contextMenu']}
              >
                <div className="catalog-tree-node-title">{node.title}</div>
              </Dropdown>
            );
          }}
          onDragEnd={(info) => {}}
          onDrop={(info) => {
            console.log(info);
          }}
          draggable={true}
          treeData={kbFlag ? editorModel.treeData : []}
          showIcon={true}
        />
      </Sider>
      <Layout>
        {kbFlag ? (
          <>
            <Header className="editor-title">
              <EditorTitle
                key={editKey ? editKey : ''}
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
                value={kbFlag ? editorModel.currentText : ''}
                instanceRef={editorRef}
                key={editKey ? editKey : ''}
                fileKey={editorModel.currentFileKey}
                editType={editorModel.currentEditType}
                blur={(text) => {
                  dispatch &&
                    dispatch({
                      type: 'editorModel/save',
                      payload: text,
                    });
                }}
              />
            </Content>
          </>
        ) : (
          <Empty
            style={{
              height: 'calc(100vh - 20px)',
              lineHeight: 'calc(100vh - 20px)',
            }}
            description={'请选择知识库'}
          />
        )}
      </Layout>
    </Layout>
  );
};

export default connect(
  ({
    editorModel,
    kbModel,
    loading,
  }: {
    kbModel: KbModelState;
    editorModel: IndexModelState;
    loading: Loading;
  }) => ({
    editorModel,
    kbModel,
    loading: loading.models.index,
  }),
)(IndexPage);
