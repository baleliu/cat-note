import DragLine from '@/components/DragLine';
import EditorCatalog from '@/components/EditorCatalog';
import EditorTitle from '@/components/EditorTitle';
import TextEditor, { changeMode } from '@/components/TextEditor';
import { Empty, Layout } from 'antd';
import { FC, useRef, useState } from 'react';
import {
  connect,
  ConnectProps,
  IndexModelState,
  KbModelState,
  Loading,
} from 'umi';
import './style.less';

const { Header, Content, Sider } = Layout;

interface PageProps extends ConnectProps {
  editorModel: IndexModelState;
  kbModel: KbModelState;
  loading: boolean;
}

const IndexPage: FC<PageProps> = ({ editorModel, kbModel, dispatch }) => {
  const editorRef: any = useRef();
  const [editKey, setEditKey] = useState<string>();
  const [showSiderWidth, setShowSiderWidth] = useState<{
    siderWidth: number;
  }>({
    siderWidth: 300,
  });

  const getKbFlag = (key?: string) => {
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

  const addCatalog = (key?: any) => {
    dispatch &&
      dispatch({
        type: 'editorModel/_createCatalog',
        payload: key,
      });
  };
  const deleteCatalog = (key?: any) => {
    dispatch &&
      dispatch({
        type: 'editorModel/_deleteCatalog',
        payload: key,
      });
  };
  const onSelect = (node: any) => {
    const { fileKey, key, title } = node;
    dispatch &&
      dispatch({
        type: 'editorModel/loadText',
        payload: node,
      });
    setEditKey(key);
  };

  const changeEditorMode = (node: any) => {
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
      changeMode(editorRef.current.getInstance(), mode, true);
    }
  };

  const onSelectKb = (id: string) => {
    dispatch &&
      dispatch({
        type: 'editorModel/loadCatalog',
        payload: id,
      });
  };

  const onChange = (text: string) => {
    dispatch &&
      dispatch({
        type: 'editorModel/saveText',
        payload: text,
      });
  };

  const onBlur = (text: string) => {
    dispatch &&
      dispatch({
        type: 'editorModel/_saveText',
        payload: text,
      });
  };

  const onChangeTitle = (e) => {
    const { value } = e.target;
    dispatch &&
      dispatch({
        type: 'editorModel/_updateCatalog',
        payload: {
          key: editorModel.currentKey,
          title: value,
        },
      });
  };
  const kbFlag = getKbFlag(editorModel.currentKb);
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
      />
      <Sider
        className="editor-sider-left"
        width={showSiderWidth.siderWidth + 'px'}
      >
        <EditorCatalog
          currentKey={editorModel.currentKey}
          onSelectKb={onSelectKb}
          defaultKb={kbFlag ? editorModel.currentKb : undefined}
          kbData={kbModel.data}
          showToolBar={kbFlag}
          onSelect={onSelect}
          addCatalog={addCatalog}
          deleteCatalog={deleteCatalog}
          treeData={kbFlag ? editorModel.treeData : []}
          nodeWidth={showSiderWidth.siderWidth - 33 + 'px'}
          width={showSiderWidth.siderWidth + 'px'}
          changeMode={changeEditorMode}
        />
      </Sider>
      <Layout>
        {kbFlag ? (
          editorModel.currentKey ? (
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
                  onChange={onChangeTitle}
                />
              </Header>
              <Content className="editor-container">
                <TextEditor
                  overview={editorModel.currentEditType == 'wysiwyg'}
                  height="calc(100vh - 80px)"
                  value={kbFlag ? editorModel.currentText : ''}
                  instanceRef={editorRef}
                  key={editKey ? editKey : ''}
                  fileKey={editorModel.currentFileKey}
                  editType={editorModel.currentEditType}
                  change={onChange}
                  blur={onBlur}
                />
              </Content>
            </>
          ) : (
            <Empty className="editor-empty" description={'请选择/新建文档'} />
          )
        ) : (
          <Empty className="editor-empty" description={'请选择库'} />
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
