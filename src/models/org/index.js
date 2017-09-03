import { arrayToTree } from 'utils';
import * as orgService from 'services/org';

export default {
  namespace: 'org',
  state: {
    orgs: [],
    select: null,
  },
  reducers: {
    refreshData(state, { payload: { list } }) {
      return { ...state, orgs: arrayToTree(list) };
    },
    select(state, { payload: { id } }) {
      return { ...state, select: id };
    },
  },
  effects: {
    *fetchIfempty(action, { put, select }) {
      const orgs = yield select(state => state.org.orgs);
      if (orgs.length === 0) {
        yield put({ type: 'fetch' });
      }
    },
    *fetch(action, { call, put }) {
      const data = yield call(orgService.fetch);
      yield put({
        type: 'refreshData',
        payload: {
          list: data,
          loading: false,
        },
      });
    },
    *add({ payload: { name, pid, loc }, callback: { onSuccess, onError } }, { call, put }) {
      const result = yield call(orgService.add, { name, pid, loc });
      if (result.success === false) {
        if (onError) {
          onError(result.message);
        }
      } else {
        if (onSuccess) {
          onSuccess();
        }
        yield put({ type: 'fetch' });
      }
    },
    *edit({ payload: { name, id, loc }, callback: { onSuccess, onError } = {} }, { call, put }) {
      const result = yield call(orgService.edit, { name, id, loc });
      if (result.success === false) {
        if (onError) {
          onError(result.message);
        }
      } else {
        if (onSuccess) {
          onSuccess();
        }

        yield put({ type: 'fetch' });
      }
    },
    *del({ payload: { id }, callback: { onSuccess, onError } = {} }, { call, put }) {
      const result = yield call(orgService.del, id);
      if (result.success === false) {
        if (onError) {
          onError(result.message);
        }
      } else {
        if (onSuccess) {
          onSuccess();
        }
        yield put({ type: 'fetch' });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/org') {
          dispatch({ type: 'fetch' });
        } else {
          dispatch({ type: 'fetchIfempty' });
        }
      });
    },
  },
};
