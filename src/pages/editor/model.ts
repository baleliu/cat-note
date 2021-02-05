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
    query: Effect;
  };
  reducers: {
    save: ImmerReducer<IndexModelState>;
    loadText: ImmerReducer<IndexModelState>;
    add: ImmerReducer<IndexModelState>;
    loadCatalog: ImmerReducer<IndexModelState>;
    updateCatalog: ImmerReducer<IndexModelState>;
    saveCatalog: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}

const IndexModel: IndexModelType = {
  namespace: 'editorModel',
  state: {
    currentText: '',
    treeData: [],
  },
  effects: {
    // 用于触发action
    // 用于调用异步逻辑，支持Promise。
    *query({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: payload,
      });
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
      let catalog = window.api.db.get('catalog');
      let { key, title } = action.payload;
      catalog && (state.treeData = catalog);
      const findNode = (
        tree: CatalogNode[],
        callback: (node: CatalogNode) => void,
      ) => {
        for (let i in tree) {
          const node = tree[i];
          if (node.key === key) {
            callback(node);
            return;
          }
          node.children && findNode(node.children, callback);
        }
      };
      findNode(state.treeData, (node) => {
        node.title = title;
      });
    },
    add(state, action) {
      const key = uuid.v4();
      const newTitle = '新建文档';
      const newTreeNode = {
        title: newTitle,
        key: key,
        fileKey: key,
      };
      state.treeData.push(newTreeNode);
      let treeData: CatalogNode[] = [...action.payload];
      treeData.push(newTreeNode);
    },
    saveCatalog(state, action) {
      window.api.db.set('catalog', action.payload);
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
