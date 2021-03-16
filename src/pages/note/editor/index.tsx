import DragLine from '@/components/DragLine';
import EditorTitle from '@/components/EditorTitle';
import TuiEditor, { changeMode } from '@/components/TuiEditor';
import {
  BookOutlined,
  ExclamationCircleOutlined,
  PlusSquareOutlined,
  DownOutlined,
} from '@ant-design/icons';
import {
  Anchor,
  Dropdown,
  Empty,
  Layout,
  Menu,
  Modal,
  Select,
  Tooltip,
  Tree,
} from 'antd';
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
const { Link } = Anchor;

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
  const [editKey, setEditKey] = useState<string>();
  const [showSiderWidth, setShowSiderWidth] = useState<{
    siderWidth: number;
  }>({
    siderWidth: 300,
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
        boundStart={300}
        onDrag={(x: number) => {
          setShowSiderWidth({
            siderWidth: 300 + x,
          });
        }}
        height="calc(100vh - 20px)"
        boundWidth="150px"
      ></DragLine>
      <Sider
        className="editor-sider-left"
        width={showSiderWidth.siderWidth + 'px'}
      >
        <Select
          className="editor-select-kb"
          onSelect={(id) => {
            dispatch &&
              dispatch({
                type: 'editorModel/loadCatalog',
                payload: id,
              });
          }}
          defaultValue={kbFlag ? editorModel.currentKb : undefined}
          showSearch
          bordered={false}
          style={{
            width: showSiderWidth.siderWidth + 'px',
            position: 'fixed',
          }}
          placeholder=""
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
        <div
          className="catalog-tool-bar"
          style={{
            width: showSiderWidth.siderWidth + 'px',
          }}
        >
          <span className="catalog-tool-btn">
            <Tooltip placement="bottomLeft" title={'创建新文档'}>
              <PlusSquareOutlined
                className="catalog-tool-btn-icon"
                color="gray"
                onClick={() => {
                  addCatalog();
                }}
              />
            </Tooltip>
          </span>
          <span className="catalog-tool-btn">
            <Tooltip placement="bottomLeft" title={'创建知识库'}>
              <BookOutlined
                className="catalog-tool-btn-icon"
                color="gray"
                onClick={() => {
                  alert('todo');
                }}
              />
            </Tooltip>
          </span>
        </div>
        <div
          className="catalog-tree-container"
          style={{
            height: 'calc(100vh - 20px)',
          }}
        >
          <Tree
            showLine={false}
            // switcherIcon={<DownOutlined/>}
            // height = {100}
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
                            confirm({
                              okText: '切换',
                              cancelText: '取消',
                              title: `是否切换模式【${node.title}】`,
                              icon: <ExclamationCircleOutlined />,
                              // content: 'Some descriptions',
                              onOk() {
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
                              },
                            });
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
                  <div
                    style={{
                      width: showSiderWidth.siderWidth - 35 + 'px',
                    }}
                    className="catalog-tree-node-title"
                  >
                    {node.title}
                  </div>
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
        </div>
      </Sider>
      <Layout>
        {kbFlag ? (
          <>
            <Header
              style={{
                marginLeft: showSiderWidth.siderWidth + 'px',
              }}
              className="editor-title"
            >
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
                marginLeft: '300px',
                height: 'calc(100vh - 80px)',
              }}
            >
              <TuiEditor
                overview={editorModel.currentEditType == 'wysiwyg'}
                height="calc(100vh - 80px)"
                value={kbFlag ? editorModel.currentText : ''}
                instanceRef={editorRef}
                key={editKey ? editKey : ''}
                fileKey={editorModel.currentFileKey}
                editType={editorModel.currentEditType}
                change={(text) => {
                  dispatch &&
                    dispatch({
                      type: 'editorModel/saveText',
                      payload: text,
                    });
                }}
                blur={(text) => {
                  dispatch &&
                    dispatch({
                      type: 'editorModel/_saveText',
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
