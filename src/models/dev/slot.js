import { message } from 'antd';
import * as slotService from 'services/dev/slot';

export default {
  namespace: 'devslot',
  state: {
    sn: '',
    slots: {},
  },
  reducers: {
    updateSlots(state, { payload: { sn, slots } }) {
      return { ...state, sn, slots };
    },
    clean(state, { payload: { sn } }) {
      return {
        ...state,
        sn,
        slots: {},
      };
    },
  },
  effects: {
    fetch: [function *({ payload: { sn } }, { call, select, put }) {
      const slots = yield call(slotService.queryBySn, sn);
      if (slots.success === false) {
        const dbsn = yield select(data => data.devslot.sn);
        if (dbsn !== sn) {
          yield put({ type: 'clean', payload: { sn } });
        }
        return message.error(slots.message);
      }
      yield put({ type: 'updateSlots', payload: { sn, slots } });
    }, { type: 'takeLatest' }],
    *edit({ payload: { sn, slots }, callback: { onSuccess } }, { call, put }) {
      const result = yield call(slotService.update, sn, slots);
      if (result.success === false) {
        return message.error(result.message);
      }
      if (onSuccess) {
        onSuccess();
      }
      yield put({ type: 'updateSlots', payload: { sn, slots } });
    },
  },
  subscriptions: {
  },
};
