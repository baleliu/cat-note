import { Effect, ImmerReducer, Subscription } from 'umi';
import { AnyAction } from 'redux';
import produce from 'immer';
import uuid from 'uuid';

interface CategoryNode {
  title: string;
  key: string;
  fileKey?: string;
  children?: CategoryNode[];
}

export interface IndexModelState {
  currentText: string;
  currentFileKey?: string;
  treeData: CategoryNode[];
}
export interface IndexModelType {
  namespace: 'editorModel';
  state: IndexModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: ImmerReducer<IndexModelState>;
    load: ImmerReducer<IndexModelState>;
    add: ImmerReducer<IndexModelState>;
    loadCatelog: ImmerReducer<IndexModelState>;
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
      console.log('save');
    },
    load(state, action) {
      state.currentFileKey = action.payload;
      state.currentText = state.currentFileKey
        ? window.api.file.readFileSync(action.payload)
        : '';
    },
    loadCatelog(state, action) {
      console.log('loadCatelog');
      let catelog = window.api.db.get('catelog');
      console.log(catelog);
      catelog && (state.treeData = catelog);
    },
    add(state, action) {
      let key = uuid.v4();
      state.treeData.push({
        title: '新建文档',
        key: key,
        fileKey: key,
      });
      console.log();
      let treeData: CategoryNode[] = [...action.payload];
      treeData.push({
        title: '新建文档',
        key: key,
        fileKey: key,
      });
      window.api.db.set('catelog', treeData);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/editor') {
          dispatch({
            type: 'loadCatelog',
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
