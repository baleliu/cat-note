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
    _updateOne: Effect;
    _deleteOne: Effect;
    _clearDustbin: Effect;
    _deleteDustbinOne: Effect;
  };
  reducers: {
    selectAll: ImmerReducer<KbModelState>;
    createOne: ImmerReducer<KbModelState>;
    updateOne: ImmerReducer<KbModelState>;
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
      storeKb(
        yield select((state: any) => {
          return state.kbModel.data;
        }),
      );
    },
    *_updateOne({ payload }, { call, put, select }) {
      yield put({
        type: 'updateOne',
        payload: payload,
      });
      storeKb(
        yield select((state: any) => {
          return state.kbModel.data;
        }),
      );
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
      if (data && data[0]) {
        state.data = data;
      }
      const dustbin = getKbDustbin();
      if (dustbin && dustbin[0]) {
        state.dustbin = dustbin;
      }
    },
    createOne(state, action) {
      state.data.push({
        id: uuid.v4(),
        ...action.payload,
      });
    },
    updateOne(state, action) {
      for (let i in state.data) {
        const { id, name, desc } = action.payload;
        if (state.data[i].id === id) {
          state.data[i].name = name;
          state.data[i].desc = desc;
        }
      }
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
          let data = getKb();
          if (data) {
            dispatch({
              type: 'globalModel/updateFooter',
              payload: `当前有库[${data.length}]`,
            });
          }
        }
      });
    },
  },
};

export default KbModel;
