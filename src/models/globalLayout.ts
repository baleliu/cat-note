import { Effect, ImmerReducer, Subscription } from 'umi';

// const electron = window.require('electron');
// const { ipcRenderer } = electron;

export interface GlobalLayoutModelState {
  name: string;
}
export interface GlobalLayoutModelType {
  namespace: 'globalLayout';
  state: GlobalLayoutModelState;
  effects: {};
  reducers: {
    load: ImmerReducer<GlobalLayoutModelState>;
    openDevTools: ImmerReducer<GlobalLayoutModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalLayoutModel: GlobalLayoutModelType = {
  namespace: 'globalLayout',
  state: {
    name: 'http://localhost:8000/#/home',
  },
  effects: {},
  reducers: {
    load(state, action) {
      state.name = action.payload;
      // ipcRenderer.send('asynchronous-message', action.payload);
    },
    openDevTools() {
      window.api.openDevTools();
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        console.log(`当前的url ${pathname}`);
      });
    },
  },
};

export default GlobalLayoutModel;
