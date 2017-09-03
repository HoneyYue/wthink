import { routerRedux } from 'dva/router';
import { message } from 'antd';

import { query, logout, login } from '../services/app';
import menu from './menu';

export default {
  namespace: 'app',
  state: {
    user: {
      name: 'admin',
    },
    permissions: {
      visit: [],
    },
    isNavbar: document.body.clientWidth < 769,
    menu,
    menuPopoverVisible: false,
    siderFold: true,
    darkTheme: true,
  },
  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(query, payload);
      if (data.success === false) {
        if (location.pathname !== '/login') {
          window.location = `${location.origin}/login`;
        }
      } else {
        yield put({ type: 'updateState', payload: { user: data } });
        if (location.pathname === '/login') {
          yield put(routerRedux.push('/'));
        }
      }
    },
    *logout({ payload }, { call, put }) {
      const data = yield call(logout, payload);
      if (data.success) {
        yield put({ type: 'query' });
      }
    },
    *login({ payload }, { call, put }) {
      const data = yield call(login, payload);
      if (data.success === false) {
        message.error(`${data.message}`);
      } else {
        yield put({ type: 'updateState', payload: { user: data } });
        yield put(routerRedux.push('/'));
      }
    },
    *changeNavbar({ payload }, { put, select }) {
      const { app } = yield (select(_ => _));
      const isNavbar = document.body.clientWidth < 769;
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar });
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    switchSider(state) {
      return {
        ...state,
        siderFold: !state.siderFold,
      };
    },

    switchTheme(state) {
      return {
        ...state,
        darkTheme: !state.darkTheme,
      };
    },

    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      };
    },

    handleNavbar(state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      };
    },
    handleNavOpenKeys(state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      };
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'query' });
    },
  },
};
