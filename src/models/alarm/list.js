import { message } from 'antd';
import * as alarmService from 'services/alarm';

export default {
  namespace: 'alarm',
  state: {
    total: 0,
    pageNo: 1,
    pageSize: 10,
    list: [],
    filter: {},
  },
  reducers: {
    refreshData(state, { payload: { total, pageNo, pageSize, list, filter } }) {
      return { ...state, total, pageNo, pageSize, list, filter };
    },
  },
  effects: {
    *fetch({ payload: { filter, pageNo = 1, pageSize = 10 } = {} }, { call, put }) {
      const data = yield call(alarmService.fetch, filter, pageNo, pageSize);
      yield put({
        type: 'refreshData',
        payload: {
          total: data.totalSize,
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          list: data.list,
          filter,
        },
      });
    },
    *add({ payload: { values }, callback: { onSuccess, onError } = {} }, { call, put, select }) {
      const result = yield call(alarmService.add, values);
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
        const filter = yield select(state => state.alarm.filter);
        yield put({ type: 'fetch', payload: { filter } });
      }
    },
    *edit({ payload: { values }, callback: { onSuccess, onError } = {} }, { call, put, select }) {
      const result = yield call(alarmService.edit, values);
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
        const state = yield select(data => data.alarm);
        yield put({ type: 'fetch', payload: { filter: state.filter, pageNo: state.pageNo, pageSize: state.pageSize } });
      }
    },
    *del({ payload: { id }, callback: { onSuccess, onError } = {} }, { call, put, select }) {
      const result = yield call(alarmService.del, id);
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
        const state = yield select(data => data.alarm);
        yield put({ type: 'fetch', payload: { filter: state.filter, pageNo: state.pageNo, pageSize: state.pageSize } });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/alarm') {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
};
