import * as rpcService from 'services/rpc';


export default {
  namespace: 'rpc',
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
      const data = yield call(rpcService.fetch, filter, pageNo, pageSize);
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
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/rpc') {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
};

