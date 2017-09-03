import * as userService from 'services/user';

export default {
  namespace: 'user',
  state: {
    total: 0,
    pageNo: 1,
    pageSize: 10,
    list: [],
    loading: false,
    filter: {},
    search: null,
  },
  reducers: {
    save(state, { payload: { total, pageNo, pageSize, loading, list, filter } }) {
      return { ...state, total, pageNo, pageSize, loading, list, filter };
    },
    load(state) {
      return { ...state, loading: true };
    },
    test(state, { payload: { val } }) {
      return { ...state, search: val };
    },
  },
  effects: {
    *fetch({ payload: { filter, pageNo = 1, pageSize = 10 } }, { call, put }) {
      yield put({ type: 'load' });
      const data = yield call(userService.fetch, filter, pageNo, pageSize);
      yield put({
        type: 'save',
        payload: {
          total: data.totalSize,
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          list: data.list,
          loading: false,
          filter,
        },
      });
    },
    *add({ payload: { values } }, { call, put, select }) {
      yield call(userService.add, values);
      const filter = yield select(state => state.user.filter);
      yield put({ type: 'fetch', payload: { filter } });
    },
    *edit({ payload: { values } }, { call, put, select }) {
      yield call(userService.edit, values);
      const state = yield select(data => data.user);
      yield put({ type: 'fetch', payload: { filter: state.filter, pageNo: state.pageNo, pageSize: state.pageSize } });
    },
    *del({ payload: { id } }, { call, put, select }) {
      yield call(userService.del, id);
      const state = yield select(data => data.user);
      yield put({ type: 'fetch', payload: { filter: state.filter, pageNo: state.pageNo, pageSize: state.pageSize } });
    },
  },
  subscriptions: {
  },
};
