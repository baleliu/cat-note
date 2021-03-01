import { Effect, ImmerReducer, Subscription } from 'umi';
import uuid from 'uuid';

export interface Kb {
  id: string;
  name: string;
  desc: string;
}

export interface KbModelState {
  data: Kb[];
  dustbin: Kb[];
}
export interface KbModelType {
  namespace: 'kbModel';
  state: KbModelState;
  effects: {
    _createOne: Effect;
    _deleteOne: Effect;
    _clearDustbin: Effect;
    _deleteDustbinOne: Effect;
  };
  reducers: {
    selectAll: ImmerReducer<KbModelState>;
    createOne: ImmerReducer<KbModelState>;
    deleteOne: ImmerReducer<KbModelState>;
    deleteDustbinOne: ImmerReducer<KbModelState>;
    clearDustbin: ImmerReducer<KbModelState>;
  };
  subscriptions: { setup: Subscription };
}

const storeKb = (data: any) => {
  window.api.db.set('kb', data, 'note');
};

const storeKbToDustbin = (data: any) => {
  window.api.db.set('kb-dustbin', data, 'note');
};

const getKb = () => {
  return window.api.db.get('kb', 'note');
};

const getKbDustbin = () => {
  return window.api.db.get('kb-dustbin', 'note');
};

const KbModel: KbModelType = {
  namespace: 'kbModel',
  state: {
    data: [],
    dustbin: [],
  },
  effects: {
    *_createOne({ payload }, { call, put, select }) {
      yield put({
        type: 'createOne',
        payload: payload,
      });
      const data = yield select((state: any) => {
        return state.kbModel.data;
      });
      storeKb(data);
    },
    *_deleteOne({ payload }, { call, put, select }) {
      yield put({
        type: 'deleteOne',
        payload: payload,
      });
      const model = yield select((state: any) => {
        return state.kbModel;
      });
      storeKb(model.data);
      storeKbToDustbin(model.dustbin);
    },
    *_deleteDustbinOne({ payload }, { call, put, select }) {
      yield put({
        type: 'deleteDustbinOne',
        payload: payload,
      });
      const model = yield select((state: any) => {
        return state.kbModel;
      });
      storeKbToDustbin(model.dustbin);
    },
    *_clearDustbin({ payload }, { call, put, select }) {
      yield put({
        type: 'clearDustbin',
        payload: payload,
      });
      storeKbToDustbin([]);
    },
  },
  reducers: {
    selectAll(state, action) {
      const data = getKb();
      if (data[0]) {
        state.data = data;
      }
      const dustbin = getKbDustbin();
      if (dustbin[0]) {
        state.dustbin = dustbin;
      }
    },
    createOne(state, action) {
      state.data.push({
        id: uuid.v4(),
        ...action.payload,
      });
    },
    deleteDustbinOne(state, action) {
      for (let i in state.dustbin) {
        if (state.dustbin[i].id === action.payload) {
          state.dustbin.splice(Number(i), 1);
        }
      }
    },
    deleteOne(state, action) {
      for (let i in state.data) {
        if (state.data[i].id === action.payload) {
          state.dustbin.push(state.data[i]);
          state.data.splice(Number(i), 1);
        }
      }
    },
    clearDustbin(state, action) {
      state.dustbin = [];
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/note/kb') {
          dispatch({
            type: 'selectAll',
          });
        }
      });
    },
  },
};

export default KbModel;
