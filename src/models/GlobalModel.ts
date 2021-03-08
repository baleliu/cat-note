import { ImmerReducer, Subscription } from 'umi';

interface SiderBar {
  id: string;
  route: string;
  name: string;
  icon: string;
}

export interface GlobalModelState {
  name: string;
  footer?: string;
  bars: SiderBar[];
}
export interface GlobalModelType {
  namespace: 'globalModel';
  state: GlobalModelState;
  effects: {};
  reducers: {
    load: ImmerReducer<GlobalModelState>;
    settingMenu: ImmerReducer<GlobalModelState>;
    updateFooter: ImmerReducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'globalModel',
  state: {
    name: 'http://localhost:8000/#/home',
    footer: '啥也没有',
    bars: [
      {
        id: '2',
        route: '/note/kb',
        name: '库',
        icon: 'BookOutlined',
      },
      {
        id: '3',
        route: '/note/editor',
        name: '写',
        icon: 'EditOutlined',
      },
      {
        id: '4',
        route: '/link',
        name: 'link',
        icon: 'EditOutlined',
      },
    ],
  },
  effects: {},
  reducers: {
    load(state, action) {
      window.api.forward(action.payload);
    },
    updateFooter(state, action) {
      state.footer = action.payload;
      console.log(action.payload);
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
