import { message } from 'antd';
import * as isoService from 'services/iso';

export default {
  namespace: 'iso',
  state: {
    total: 0,
    pageNo: 1,
    pageSize: 10,
    list: [],
    filter: {},
    iosVer: {},
  },
  reducers: {
    refreshData(state, { payload: { total, pageNo, pageSize, list, filter, iosVer } }) {
      return { ...state, total, pageNo, pageSize, list, filter, iosVer };
    },
  },
  effects: {
    *fetch({ payload: { filter, pageNo = 1, pageSize = 10, onlineOnlie } = {} }, { call, put }) {
      const [data, iosVerData] = yield [call(isoService.fetch, filter, pageNo, pageSize),
        call(isoService.group, onlineOnlie)];
      yield put({
        type: 'refreshData',
        payload: {
          total: data.totalSize,
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          list: data.list,
          iosVer: iosVerData,
          filter,
        },
      });
    },
    *refersh(action, { select, put }) {
      const filter = yield select(data => data.iso.filter);
      yield put({ type: 'fetch', payload: { filter } });
    },
    *open({ payload: { id, type } }, { call, put }) {
      const result = yield call(isoService.upSwitch, type, id, true);
      if (result.success === false) {
        return message.error(result.message);
      }
      yield put({ type: 'refersh' });
    },
    *close({ payload: { id, type } }, { call, put }) {
      const result = yield call(isoService.upSwitch, type, id, false);
      if (result.success === false) {
        return message.error(result.message);
      }
      yield put({ type: 'refersh' });
    },
    *add({ payload: { values }, callback: { onSuccess, onError } = {} }, { call, put, select }) {
      const result = yield call(isoService.add, values);
      if (result.success === false) {
        if (onError) {
          onError(result.message);
        } else {
          message.error(result.message);
        }
      } else {
        if (onSuccess) {
          onSuccess();
        }
        const filter = yield select(state => state.iso.filter);
        yield put({ type: 'fetch', payload: { filter } });
      }
    },
    *edit({ payload: { values }, callback: { onSuccess, onError } = {} }, { call, put, select }) {
      const result = yield call(isoService.edit, values);
      if (result.success === false) {
        if (onError) {
          onError(result.message);
        } else {
          message.error(result.message);
        }
      } else {
        if (onSuccess) {
          onSuccess();
        }
        const state = yield select(data => data.iso);
        yield put({ type: 'fetch', payload: { filter: state.filter, pageNo: state.pageNo, pageSize: state.pageSize } });
      }
    },
    *del({ payload: { id }, callback: { onSuccess, onError } = {} }, { call, put, select }) {
      const result = yield call(isoService.del, id);
      if (result.success === false) {
        if (onError) {
          onError(result.message);
        } else {
          message.error(result.message);
        }
      } else {
        if (onSuccess) {
          onSuccess();
        }
        const state = yield select(data => data.iso);
        yield put({ type: 'fetch', payload: { filter: state.filter, pageNo: state.pageNo, pageSize: state.pageSize } });
      }
    },
    *ver({ payload: { onlineOnlie } }, { call, put, select }) {
      const result = yield call(isoService.group, onlineOnlie);
      if (result.success === false) {
        message.error(result.message);
      } else {
        const state = yield select(data => data.iso);
        yield put({
          type: 'refreshData',
          payload: {
            ...state,
          },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/iso') {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
};
