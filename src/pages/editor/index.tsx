import DragLine from '@/components/DragLine';
import TuiEditor from '@/components/TuiEditor';
import EditorTitle from '@/components/EditorTitle';
import { CarryOutOutlined, PlusSquareOutlined } from '@ant-design/icons';

import { Input, Layout, Select, Tree } from 'antd';
import React, { FC, useRef, useState } from 'react';
import { connect, ConnectProps, IndexModelState, Loading } from 'umi';
import './style.less';

const { Header, Content, Sider } = Layout;
const { Option } = Select;

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
              dispatch &&
                dispatch({
                  type: 'editorModel/add',
                  payload: editorModel.treeData,
                });
              dispatch &&
                dispatch({
                  type: 'editorModel/saveCatalog',
                  payload: editorModel.treeData,
                });
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
          onDragEnd={(info) => {
            // console.log(info);
          }}
          onDrop={(info) => {
            console.log(info);
            // const dropKey = info.node.key;
            // const dragKey = info.dragNode.key;
            // const dropPos = info.node.pos.split('-');
            // const dropPosition =
            //   info.dropPosition - Number(dropPos[dropPos.length - 1]);
            // const loop = (data, key, callback) => {
            //   for (let i = 0; i < data.length; i++) {
            //     if (data[i].key === key) {
            //       return callback(data[i], i, data);
            //     }
            //     if (data[i].children) {
            //       loop(data[i].children, key, callback);
            //     }
            //   }
            // };
            // const data = [...editorModel.treeData];
            // // Find dragObject
            // let dragObj;
            // loop(data, dragKey, (item, index, arr) => {
            //   data.splice(index, 1);
            //   dragObj = item;
            // });

            // if (!info.dropToGap) {
            //   // Drop on the content
            //   loop(data, dropKey, (item) => {
            //     item.children = item.children || [];
            //     // where to insert 示例添加到头部，可以是随意位置
            //     item.children.unshift(dragObj);
            //   });
            // } else if (
            //   (info.node.props.children || []).length > 0 && // Has children
            //   info.node.props.expanded && // Is expanded
            //   dropPosition === 1 // On the bottom gap
            // ) {
            //   loop(data, dropKey, (item) => {
            //     item.children = item.children || [];
            //     // where to insert 示例添加到头部，可以是随意位置
            //     item.children.unshift(dragObj);
            //     // in previous version, we use item.children.push(dragObj) to insert the
            //     // item to the tail of the children
            //   });
            // } else {
            //   let ar;
            //   let i;
            //   loop(data, dropKey, (item, index, arr) => {
            //     ar = arr;
            //     i = index;
            //   });
            //   if (dropPosition === -1) {
            //     data.splice(i, 0, dragObj);
            //   } else {
            //     data.splice(i + 1, 0, dragObj);
            //   }
            // }
            // // dispatch &&
            // //   dispatch({
            // //     type: 'editorModel/save',
            // //     payload: data,
            // //   });
            // console.log(data);
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
                  type: 'editorModel/updateCatalog',
                  payload: {
                    key: editorModel.currentKey,
                    title: value,
                  },
                });
            }}
            onBlur={(e) => {
              dispatch &&
                dispatch({
                  type: 'editorModel/saveCatalog',
                  payload: editorModel.treeData,
                });
            }}
          />
        </Header>
        <Content
          style={{
            padding: '0 0px',
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
