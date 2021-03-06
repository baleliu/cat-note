import { Effect, ImmerReducer, Subscription } from 'umi';
import uuid from 'uuid';
interface CatalogNode {
  title: string;
  key: string;
  fileKey?: string;
  editType?: string;
  children?: CatalogNode[];
}

export interface IndexModelState {
  currentText: string;
  currentFileKey?: string;
  currentTitle?: string;
  currentKey?: string;
  currentKb?: string;
  currentEditType: 'markdown' | 'wysiwyg';
  treeData: CatalogNode[];
}
export interface IndexModelType {
  namespace: 'editorModel';
  state: IndexModelState;
  effects: {
    _createCatalog: Effect;
    _saveText: Effect;
    _updateCatalog: Effect;
    _deleteCatalog: Effect;
  };
  reducers: {
    saveText: ImmerReducer<IndexModelState>;
    loadText: ImmerReducer<IndexModelState>;
    createCatalog: ImmerReducer<IndexModelState>;
    deleteCatalog: ImmerReducer<IndexModelState>;
    loadCatalog: ImmerReducer<IndexModelState>;
    updateCatalog: ImmerReducer<IndexModelState>;
    toggleEditType: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}

const findNode = (
  tree: CatalogNode[],
  key: string,
  callback: (node: CatalogNode, subTree: CatalogNode[], index: number) => void,
) => {
  for (let i in tree) {
    const node = tree[i];
    if (node.key === key) {
      callback(node, tree, Number(i));
      return;
    }
    node.children && findNode(node.children, key, callback);
  }
};

const storeCatalog = (data: IndexModelState) => {
  window.api.db.set('catalog.' + data.currentKb, data.treeData, 'note');
};
const getCatalog = (key?: string) => {
  return window.api.db.get('catalog.' + key, 'note');
};
const writeFile = window.api.file.writeFile;
const readFileSync = window.api.file.readFileSync;

const IndexModel: IndexModelType = {
  namespace: 'editorModel',
  state: {
    currentText: '',
    treeData: [],
    currentEditType: 'wysiwyg',
  },
  effects: {
    *_saveText({ payload }, { call, put, select }) {
      yield put({
        type: 'saveText',
        payload: payload,
      });
      const data = yield select((state: any) => {
        return state.editorModel;
      });
      console.log(data);
      data.currentFileKey &&
        writeFile({
          fileKey: data.currentFileKey,
          data: data.currentText,
        });
    },
    *_createCatalog({ payload }, { call, put, select }) {
      yield put({
        type: 'createCatalog',
        payload: payload,
      });
      const data = yield select((state: any) => {
        return state.editorModel;
      });
      storeCatalog(data);
    },
    *_updateCatalog({ payload }, { call, put, select }) {
      yield put({
        type: 'updateCatalog',
        payload: payload,
      });
      const data = yield select((state: any) => {
        return state.editorModel;
      });
      storeCatalog(data);
    },
    *_deleteCatalog({ payload }, { call, put, select }) {
      yield put({
        type: 'deleteCatalog',
        payload: payload,
      });
      const data = yield select((state: any) => {
        return state.editorModel;
      });
      storeCatalog(data);
    },
  },
  reducers: {
    saveText(state, action) {
      state.currentText = action.payload;
    },
    toggleEditType(state, action) {
      if (state.currentEditType === 'markdown') {
        state.currentEditType = 'wysiwyg';
      } else {
        state.currentEditType = 'markdown';
      }
    },
    loadText(state, action) {
      const { fileKey, title, key, editType } = action.payload;
      state.currentKey = key;
      state.currentFileKey = fileKey;
      state.currentTitle = title;
      if (editType) {
        state.currentEditType = editType;
      } else {
        state.currentEditType = 'wysiwyg';
      }
      state.currentText = state.currentFileKey ? readFileSync({ fileKey }) : '';
    },
    loadCatalog(state, action) {
      state.currentKb = action.payload;
      let catalog = getCatalog(action.payload);
      if (catalog) {
        state.treeData = catalog;
      } else {
        state.treeData = [];
      }
    },
    updateCatalog(state, action) {
      let { key, title, editType } = action.payload;
      console.log(`updateCatalog ${editType}`);
      findNode(state.treeData, key, (node) => {
        if (title) {
          node.title = title;
        }
        if (editType) {
          node.editType = editType;
        }
      });
      if (editType) {
        state.currentEditType = editType;
      }
    },
    createCatalog(state, action) {
      const newKey = uuid.v4();
      const newTitle = '新建文档';
      const newTreeNode = {
        title: newTitle,
        key: newKey,
        fileKey: newKey,
        editType: 'wysiwyg',
      };
      if (action.payload) {
        findNode(state.treeData, action.payload, (node) => {
          if (node.children) {
            node.children.push(newTreeNode);
          } else {
            node.children = [newTreeNode];
          }
        });
      } else {
        state.treeData.push(newTreeNode);
      }
    },
    deleteCatalog(state, action) {
      findNode(state.treeData, action.payload, (node, subTree, index) => {
        subTree.splice(index, 1);
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen((e) => {
        let { pathname } = e;
        let {
          query: { kbId },
        } = e as any;
        if (pathname === '/note/editor') {
          dispatch({
            type: 'kbModel/selectAll',
          });
          if (kbId) {
            dispatch({
              type: 'loadCatalog',
              payload: kbId,
            });
          }
          dispatch({
            type: 'globalModel/updateFooter',
            payload: '',
          });
        }
      });
    },
  },
};

export default IndexModel;
