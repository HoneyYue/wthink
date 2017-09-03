import { queryTree } from 'utils';
import * as curService from 'services/curdetail';

export default {
  namespace: 'curdetail',
  state: {
    currenList: [],
    total: 0,
    online: 0,
    alarm: 0,
  },
  reducers: {
    refreshData(state, { payload: { total, online, alarm } }) {
      return { ...state, total, online, alarm };
    },
    updateCurren(state, { payload: { currenList } }) {
      return { ...state, currenList };
    },
    reloadCurren(state, { payload: { id, name, data } }) {
      let searchIndex;
      state.currenList.findIndex((org, index) => {
        if (org.id === id) {
          searchIndex = index;
          return true;
        }
        return false;
      });
      const currenList = [
        ...state.currenList.slice(0, searchIndex),
        { ...data, id, name },
        ...state.currenList.slice(searchIndex + 1),
      ];
      return { ...state, currenList };
    },
  },
  effects: {
    *fetch({ payload: { id } }, { put, call, select }) {
      const dataList = yield call(curService.fetch, { id, expand: true });
      const orgList = yield select(data => data.org.orgs);
      const org = queryTree(orgList, id);
      const currenList = [];
      yield put({
        type: 'refreshData',
        payload: {
          total: dataList.total,
          online: dataList.online,
          alarm: dataList.alarm,
        },
      });
      if (org.children) {
        for (let i = 0; i < org.children.length; i += 1) {
          currenList.push({
            name: org.children[i].name,
            id: org.children[i].id,
          });
        }
      }
      yield put({
        type: 'updateCurren',
        payload: {
          currenList,
        },
      });
      for (let i = 0; i < currenList.length; i += 1) {
        const val = {
          id: currenList[i].id,
        };
        const data = yield call(curService.fetch, val);
        yield put({
          type: 'reloadCurren',
          payload: {
            id: currenList[i].id,
            name: currenList[i].name,
            data,
          },
        });
      }
    },
    *query({ payload: { values } = {} }, { put, call, select }) {
      const datas = yield call(curService.fetch, { expend: true });
      const orgList = yield select(dataList => dataList.org.orgs);
      const currenList = [];
      yield put({
        type: 'refreshData',
        payload: {
          total: datas.total,
          online: datas.online,
          alarm: datas.alarm,
        },
      });
      if (orgList.length) {
        for (let i = 0; i < orgList.length; i += 1) {
          currenList.push({
            name: orgList[i].name,
            id: orgList[i].id,
          });
        }
      }

      yield put({
        type: 'updateCurren',
        payload: {
          currenList,
        },
      });
      for (let i = 0; i < currenList.length; i += 1) {
        const val = {
          id: currenList[i].id,
        };
        const data = yield call(curService.fetch, val);
        yield put({
          type: 'reloadCurren',
          payload: {
            id: currenList[i].id,
            name: currenList[i].name,
            data,
          },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/curdetail') {
          dispatch({ type: 'query' });
        }
      });
    },
  },
};
