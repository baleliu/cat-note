import { Effect, ImmerReducer, Subscription } from 'umi';
import uuid from 'uuid';

// const Store = window.require('electron-store');
// const store = new Store();

interface CategoryNode {
  title: string;
  key: string;
  fileKey?: string;
  children?: CategoryNode[];
}

export interface IndexModelState {
  name: string;
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
    add: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}

const IndexModel: IndexModelType = {
  namespace: 'editorModel',
  state: {
    name: 'liuwentao text hello world',
    treeData: [
      {
        title: 'parent 1',
        key: '0-0',
        fileKey: '/Users/bale/Desktop/index.tsx',
        children: [
          {
            title: 'parent 1-0',
            key: '0-0-0',
            children: [
              { title: 'leaf', key: '0-0-0-0' },
              {
                title: 'hahah',
                key: '0-0-0-1',
              },
              { title: 'leaf', key: '0-0-0-2' },
            ],
          },
          {
            title: 'parent 1-1',
            key: '0-0-1',
            children: [{ title: 'leaf', key: '0-0-1-0' }],
          },
          {
            title: 'parent 1-2',
            key: '0-0-2',
            children: [
              { title: 'leaf', key: '0-0-2-0' },
              {
                title: 'leaf',
                key: '0-0-2-1',
              },
            ],
          },
        ],
      },
      {
        title: 'parent 2',
        key: '0-1',
        children: [
          {
            title: 'parent 2-0',
            key: '0-1-0',
            children: [
              { title: 'leaf', key: '0-1-0-0' },
              { title: 'leaf', key: '0-1-0-1' },
            ],
          },
        ],
      },
    ],
  },
  effects: {
    // 用于触发action
    // 用于调用异步逻辑，支持Promise。
    *query({ payload }, { call, put }) {
      console.log('query');
      // console.log(payload);
      yield put({
        type: 'save',
        payload: payload,
      });
    },
  },
  reducers: {
    save(state, action) {
      state.name = action.payload;
      console.log('save');
      console.log(state.name);
    },
    add(state, action) {
      state.treeData.push({
        title: '新建文档',
        key: uuid.v4(),
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/editor') {
          dispatch({
            type: 'save',
            payload: window.api.file.readFileSync(
              '/Users/bale/Desktop/index.tsx',
            ),
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
