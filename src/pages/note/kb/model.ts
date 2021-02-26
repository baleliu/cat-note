import { Effect, ImmerReducer, Subscription } from 'umi';
import uuid from 'uuid';

export interface Kb {
  id: string;
  name: string;
  desc: string;
}

export interface KbModelState {
  data: Kb[];
}
export interface KbModelType {
  namespace: 'kbModel';
  state: KbModelState;
  effects: {
    _createOne: Effect;
    _deleteOne: Effect;
  };
  reducers: {
    selectAll: ImmerReducer<KbModelState>;
    createOne: ImmerReducer<KbModelState>;
    deleteOne: ImmerReducer<KbModelState>;
  };
  subscriptions: { setup: Subscription };
}

const storeKb = (data: any) => {
  window.api.db.set('kb', data, 'note');
};

const getKb = () => {
  return window.api.db.get('kb', 'note');
};

const KbModel: KbModelType = {
  namespace: 'kbModel',
  state: {
    data: [],
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
      const data = yield select((state: any) => {
        return state.kbModel.data;
      });
      storeKb(data);
    },
  },
  reducers: {
    selectAll(state, action) {
      const data = getKb();
      if (data[0]) {
        state.data = data;
      }
    },
    createOne(state, action) {
      state.data.push({
        id: uuid.v4(),
        ...action.payload,
      });
    },
    deleteOne(state, action) {
      for (let i in state.data) {
        if (state.data[i].id === action.payload) {
          state.data.splice(Number(i), 1);
        }
      }
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
