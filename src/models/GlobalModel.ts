import { ImmerReducer, Subscription } from 'umi';

export interface GlobalModelState {
  name: string;
}
export interface GlobalModelType {
  namespace: 'globalLayout';
  state: GlobalModelState;
  effects: {};
  reducers: {
    load: ImmerReducer<GlobalModelState>;
    settingMenu: ImmerReducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'globalLayout',
  state: {
    name: 'http://localhost:8000/#/home',
  },
  effects: {},
  reducers: {
    load(state, action) {
      window.api.forward(action.payload);
    },
    settingMenu() {
      window.api.settingMenu();
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        // console.log(`当前的url ${pathname}`);
      });
    },
  },
};

export default GlobalModel;
