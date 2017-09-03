import { message } from 'antd';
import * as devService from 'services/dev/dev';
import * as alarmService from 'services/alarm';

export default {
  namespace: 'dev',
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
    updateAlarm(state, { payload: { list } }) {
      return { ...state, list };
    },
  },
  effects: {
    *fetch({ payload: { filter, pageNo = 1, pageSize = 10 } = {} }, { call, put }) {
      const data = yield call(devService.fetch, filter, pageNo, pageSize);
      yield put({
        type: 'refreshData',
        payload: {
          total: data.totalSize,
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          list: data.list.map((dev) => {
            return { ...dev, loc: { lat: dev.lat, lng: dev.lng, address: dev.address } };
          }),
          filter,
        },
      });
      const alarmIds = data.list
        .filter(dev => dev.alarms && dev.alarms.length > 0)
        .map(dev => dev.alarms[dev.alarms.length - 1]);
      if (alarmIds.length > 0) {
        yield put({ type: 'fetchAlarm', payload: { alarmIds } });
      }
    },
    *refersh(action, { select, put }) {
      const filter = yield select(data => data.dev.filter);
      yield put({ type: 'fetch', payload: { filter } });
    },
    fetchAlarm: [function *({ payload: { alarmIds } }, { call, select, put }) {
      const alarms = yield call(alarmService.queryByIds, alarmIds);
      if (alarms.success === false) {
        return message.error(alarms.message);
      }
      const devs = yield select(data => data.dev.list);
      const result = devs
        .map((dev) => {
          return { ...dev, firstAlarm: alarms.find(alarm => alarm.sn === dev.sn) };
        });
      yield put({ type: 'updateAlarm', payload: { list: result } });
    }, { type: 'takeLatest' }],
    *add({ payload: { values }, callback: { onSuccess, onError } = {} }, { call, put, select }) {
      const result = yield call(devService.add, values);
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
        const filter = yield select(state => state.dev.filter);
        yield put({ type: 'fetch', payload: { filter } });
      }
    },
    *edit({ payload: { values }, callback: { onSuccess, onError } = {} }, { call, put, select }) {
      const result = yield call(devService.edit, values);
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
        const state = yield select(data => data.dev);
        yield put({ type: 'fetch', payload: { filter: state.filter, pageNo: state.pageNo, pageSize: state.pageSize } });
      }
    },
    *del({ payload, callback: { onSuccess, onError } = {} }, { call, put, select }) {
      const result = yield call(devService.del, payload);
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
        const state = yield select(data => data.dev);
        yield put({ type: 'fetch', payload: { filter: state.filter, pageNo: state.pageNo, pageSize: state.pageSize } });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/dev') {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
};
