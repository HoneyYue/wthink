import { message } from 'antd';
import * as alarmService from 'services/alarm';

export default {
  namespace: 'camalarm',
  state: {
    sn: null,
    current: [],
    history: { pageNo: 1, pageSize: 10, list: [], total: 0 },
  },
  reducers: {
    updateAlarm(state, { payload: { sn, current } }) {
      return { ...state, sn, current };
    },
    updateHistory(state, { payload: { pageNo, pageSize, totalSize, list } }) {
      return { ...state, pageNo, pageSize, total: totalSize, list };
    },
    clean(state, { payload: { sn } }) {
      return {
        ...state,
        sn,
        current: [],
        history: { pageNo: 1, pageSize: 10, list: [], total: 0 },
      };
    },
  },
  effects: {
    fetch: [function *({ payload: { sn } }, { call, select, put }) {
      const dbsn = yield select(data => data.camalarm.sn);
      if (dbsn !== sn) {
        yield put({ type: 'clean', payload: { sn } });
      }
      const current = yield call(alarmService.queryNotCleanBySn, sn);
      if (current.success === false) {
        return message.error(current.message);
      }
      yield put({ type: 'updateAlarm', payload: { sn, current } });
    }, { type: 'takeLatest' }],
    fetchHistory: [function *({ payload: { sn, pageNo = 1, pageSize = 10 } }, { call, put }) {
      const history = yield call(alarmService.queryHistory, sn, pageNo, pageSize);
      if (history.success === false) {
        return message.error(history.message);
      }
      yield put({ type: 'updateHistory', payload: history });
    }, { type: 'takeLatest' }],
  },
  subscriptions: {
  },
};
