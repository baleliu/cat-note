import * as FileUtil from '@/infra/util/FileUtil';
import { Effect, ImmerReducer, Subscription } from 'umi';

// const Store = window.require('electron-store');
// const store = new Store();

export interface IndexModelState {
  name: string;
}
export interface IndexModelType {
  namespace: 'index';
  state: IndexModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}

const IndexModel: IndexModelType = {
  namespace: 'index',
  state: {
    name: 'liuwentao text hello world',
  },
  effects: {
    // 用于触发action
    // 用于调用异步逻辑，支持Promise。
    *query({ payload }, { call, put }) {
      console.log('query');
      console.log(payload);
      yield put({
        type: 'save',
        payload: payload,
      });
    },
  },
  reducers: {
    save(state, action) {
      state.name = action.payload;
      // console.log('save');
      // console.log(action.payload);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/editor') {
          dispatch({
            type: 'query',
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
