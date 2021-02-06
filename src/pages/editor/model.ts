import { Effect, ImmerReducer, Subscription } from 'umi';
import uuid from 'uuid';

interface CatalogNode {
  title: string;
  key: string;
  fileKey?: string;
  children?: CatalogNode[];
}

export interface IndexModelState {
  currentText: string;
  currentFileKey?: string;
  currentTitle?: string;
  currentKey?: string;
  treeData: CatalogNode[];
}
export interface IndexModelType {
  namespace: 'editorModel';
  state: IndexModelState;
  effects: {
    _createCatalog: Effect;
    _updateCatalog: Effect;
    _deleteCatalog: Effect;
  };
  reducers: {
    save: ImmerReducer<IndexModelState>;
    loadText: ImmerReducer<IndexModelState>;
    createCatalog: ImmerReducer<IndexModelState>;
    deleteCatalog: ImmerReducer<IndexModelState>;
    loadCatalog: ImmerReducer<IndexModelState>;
    updateCatalog: ImmerReducer<IndexModelState>;
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

const storeCatalog = (treeData: any) => {
  window.api.db.set('catalog', treeData);
};

const IndexModel: IndexModelType = {
  namespace: 'editorModel',
  state: {
    currentText: '',
    treeData: [],
  },
  effects: {
    *_createCatalog({ payload }, { call, put, select }) {
      yield put({
        type: 'createCatalog',
        payload: payload,
      });
      const treeData = yield select((state: any) => {
        return state.editorModel.treeData;
      });
      storeCatalog(treeData);
    },
    *_updateCatalog({ payload }, { call, put, select }) {
      yield put({
        type: 'updateCatalog',
        payload: payload,
      });
      const treeData = yield select((state: any) => {
        return state.editorModel.treeData;
      });
      storeCatalog(treeData);
    },
    *_deleteCatalog({ payload }, { call, put, select }) {
      yield put({
        type: 'deleteCatalog',
        payload: payload,
      });
      const treeData = yield select((state: any) => {
        return state.editorModel.treeData;
      });
      storeCatalog(treeData);
    },
  },
  reducers: {
    save(state, action) {
      state.currentText = action.payload;
      console.log(state.currentFileKey);
      state.currentFileKey &&
        window.api.file.writeFile({
          fileKey: state.currentFileKey,
          data: state.currentText,
        });
    },
    loadText(state, action) {
      const { fileKey, title, key } = action.payload;
      state.currentKey = key;
      state.currentFileKey = fileKey;
      state.currentTitle = title;
      state.currentText = state.currentFileKey
        ? window.api.file.readFileSync(fileKey)
        : '';
    },
    loadCatalog(state, action) {
      let catalog = window.api.db.get('catalog');
      catalog && (state.treeData = catalog);
    },
    updateCatalog(state, action) {
      let { key, title } = action.payload;
      findNode(state.treeData, key, (node) => {
        node.title = title;
      });
    },
    createCatalog(state, action) {
      const newKey = uuid.v4();
      const newTitle = '新建文档';
      const newTreeNode = {
        title: newTitle,
        key: newKey,
        fileKey: newKey,
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
      return history.listen(({ pathname }) => {
        if (pathname === '/editor') {
          dispatch({
            type: 'loadCatalog',
          });
          // store.set('category.a', {
          //   title: 'testTitle',
          //   fileKey: '/Users/bale/Desktop/index.tsx',
          // });
          // console.log(store.get('category.a.title'));
          // console.log(store.get('category.a.fileKey'));
        }
      });
    },
  },
};

export default IndexModel;
