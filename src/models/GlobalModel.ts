import { ImmerReducer, Subscription } from 'umi';

interface SiderBar {
  id: string;
  route: string;
  name: string;
  icon: string;
}

export interface GlobalModelState {
  name: string;
  bars: SiderBar[];
}
export interface GlobalModelType {
  namespace: 'globalModel';
  state: GlobalModelState;
  effects: {};
  reducers: {
    load: ImmerReducer<GlobalModelState>;
    settingMenu: ImmerReducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'globalModel',
  state: {
    name: 'http://localhost:8000/#/home',
    bars: [
      {
        id: '2',
        route: '/note/editor',
        name: '写',
        icon: 'EditOutlined',
      },
      {
        id: '3',
        route: '/note/kb',
        name: '知识库',
        icon: 'BookOutlined',
      },
    ],
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
      console.log('一定会执行的');
      return history.listen(({ pathname }) => {
        // console.log(`当前的url ${pathname}`);
      });
    },
  },
};

export default GlobalModel;
