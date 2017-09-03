import Moment from 'moment';
import * as statService from 'services/stat';
import * as alarmService from 'services/alarm';

export default {
  namespace: 'stat',
  state: {
    alarm: {
      total: 0,
      pageNo: 1,
      pageSize: 10,
      list: [],
    },
    chart: {
      total: 0,
      net: 0,
      power: 0,
      links: 0,
      camera: 0,
    },
    filter: {
      orgs: null,
      type: null,
      time: {
        start: Moment().subtract(7, 'days'),
        end: Moment(),
      },
    },

  },
  reducers: {
    refreshFilter(state, { payload: { orgs, time, type } }) {
      return { ...state, filter: { orgs, time, type } };
    },
    refreshChart(state, { payload: { total = 0, net = 0, power = 0, links = 0, camera = 0 } }) {
      return { ...state, chart: { total, net, power, links, camera } };
    },
    refreshEntry(state, { payload: { total, pageNo, pageSize, list, filter } }) {
      return { ...state, alarm: { total, pageNo, pageSize, list, filter } };
    },
  },
  effects: {
    *fetch({ payload: { values } = {} }, { put, call, select }) {
      const times = yield select(state => state.stat.filter.time);
      if (values) {
        yield put({
          type: 'refreshFilter',
          payload: {
            orgs: values.orgs,
            time: values.time,
            type: null,
          },
        });
      } else {
        yield put({
          type: 'refreshFilter',
          payload: {
            orgs: null,
            time: times,
            type: null,
          },
        });
      }
      const orgs = yield select(state => state.stat.filter.orgs);
      const time = yield select(state => state.stat.filter.time);
      const data = yield call(statService.fetch, { orgs, time });
      yield put({ type: 'fetchAlarm' });
      yield put({
        type: 'refreshChart',
        payload: {
          total: data.total,
          net: data.net,
          power: data.power,
          links: data.link,
          camera: data.camera,
        },
      });
    },
    *fetchAlarm({ payload: { filter: { type } = {}, pageNo = 1, pageSize = 10 } = {} },
      { put, call, select }) {
      const orgs = yield select(state => state.stat.filter.orgs);
      const time = yield select(state => state.stat.filter.time);
      const data = yield call(alarmService.fetch, { type, orgs, alarmAt: time }, pageNo, pageSize);
      yield put({
        type: 'refreshFilter',
        payload: {
          orgs,
          time,
          type,
        },
      });
      yield put({
        type: 'refreshEntry',
        payload: {
          total: data.totalSize,
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          list: data.list,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/stat') {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
};
