import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { queryTree } from 'utils';

import * as detailService from 'services/dev/detail';
import * as slotService from 'services/dev/slot';
import * as rpclistService from 'services/rpc/index';

export default {
  namespace: 'devdetail',
  state: {
    sn: null,
    online: false,
    master: null,
    type: null,
    sver: null,
    hver: null,
    loc: null,
    org: null,
    off: null,
    slots: [],
    data: {},
  },
  reducers: {
    updateDate(state, { payload: { data } }) {
      return { ...state, ...data };
    },
  },
  effects: {
    *fetch({ payload: { sn, pageNo = 1, pageSize = 10 } = {} }, { call, put, select }) {
      const [data, slots, rpclist] = yield [call(detailService.fetch, sn),
        call(slotService.queryBySn, sn), call(rpclistService.fetch, sn, pageNo, pageSize)];
      if (data.success === false) {
        message.error(data.message);
        return yield put(routerRedux.goBack());
      }
      if (data.org) {
        const orgs = yield select(state => state.org.orgs);
        const org = queryTree(orgs, data.org);
        if (org) {
          data.org = org.name;
        } else {
          data.org = null;
        }
      }
      const detail = data.detail || {};
      const result = {
        sver: detail.sVer,
        hver: detail.hVer,
        nbssi: detail.nbSsi,
        lrssi: detail.lrSsi,
        offAt: detail.offAt,
        onlineAt: detail.onlineAt,
        sn: data.sn,
        online: data.online,
        master: data.master,
        type: data.type,
        org: data.org,
        off: data.off,
        slots: slots || [],
        loc: { lat: data.lat, lng: data.lng, address: data.address },
        data: {
          sn,
          list: rpclist.list,
          pageNo: rpclist.pageNo,
          pageSize: rpclist.pageSize,
          total: rpclist.totalSize,
        },
      };
      yield put({
        type: 'updateDate',
        payload: { data: result },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname.startsWith('/detail/')) {
          const sn = pathname.substr(8);
          const filter = {
            sn,
          };
          if (sn.indexOf('/') < 0) {
            dispatch({ type: 'fetch', payload: { sn } });
            dispatch({ type: 'devalarm/fetch', payload: { sn } });
            dispatch({ type: 'alarm/fetch', payload: { filter } });
          }
        }
      });
    },
  },
};
