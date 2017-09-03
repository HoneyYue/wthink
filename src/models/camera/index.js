import { message } from 'antd';
import * as cameraService from 'services/camera';

export default {
  namespace: 'camera',
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
      const data = yield call(cameraService.fetch, filter, pageNo, pageSize);
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
    // fetchAlarm: [function *({ payload: { alarmIds } }, { call, select, put }) {
    //   const alarms = yield call(alarmService.queryByIds, alarmIds);
    //   if (alarms.success === false) {
    //     return message.error(alarms.message);
    //   }
    //   const devs = yield select(data => data.dev.list);
    //   const result = devs
    //     .map((dev) => {
    //       return { ...dev, firstAlarm: alarms.find(alarm => alarm.sn === dev.sn) };
    //     });
    //   yield put({ type: 'updateAlarm', payload: { list: result } });
    // }, { type: 'takeLatest' }],
    *add({ payload: { values }, callback: { onSuccess, onError } = {} }, { call, put, select }) {
      console.log(values)
      // const result = yield call(cameraService.add, values);
      // if (result.success === false) {
      //   if (onError) {
      //     onError(result.message);
      //   } else {
      //     message.error(result.message);
      //   }
      // } else {
      //   if (onSuccess) {
      //     onSuccess();
      //   }
      //   const filter = yield select(state => state.camera.filter);
      //   yield put({ type: 'fetch', payload: { filter } });
      // }
    },
    *edit({ payload: { values }, callback: { onSuccess, onError } = {} }, { call, put, select }) {
      const result = yield call(cameraService.edit, values);
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
        const state = yield select(data => data.camera);
        yield put({ type: 'fetch', payload: { filter: state.filter, pageNo: state.pageNo, pageSize: state.pageSize } });
      }
    },
    *del({ payload: { id }, callback: { onSuccess, onError } = {} }, { call, put, select }) {
      const result = yield call(cameraService.del, id);
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
        const state = yield select(data => data.camera);
        yield put({ type: 'fetch', payload: { filter: state.filter, pageNo: state.pageNo, pageSize: state.pageSize } });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/camera') {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
};
