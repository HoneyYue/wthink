import * as devService from 'services/dev/map';

const MAX_MARKERSIZE = 100;
const ALL = 'ALL';
const ON = 'ON';
const OFF = 'OFF';

export default {
  namespace: 'devmap',
  state: {
    filter: {
      org: null,
      sn: null,
      status: ALL,
    },
    statistic: {
      total: 0,
      online: 0,
    },
    center: {
      lat: 30.343399047851562,
      lng: 104.2342300415039,
      zoom: 7,
    },
    bounds: {}, // 地图范围
    devs: [], //
    markers: [],
    select: null,
  },
  reducers: {
    updateDevs(state, { payload: { devs } }) {
      return { ...state, devs };
    },
    updateBounds(state, { payload: { bounds } }) {
      return { ...state, bounds };
    },
    updateMarkers(state, { payload: { markers } }) {
      return { ...state, markers };
    },
    updateSelect(state, { payload: { select } }) {
      return { ...state, select };
    },
    updateFilter(state, { payload: { filter } }) {
      return { ...state, filter };
    },
    updateStatistic(state, { payload: { statistic } }) {
      return { ...state, statistic };
    },
  },
  effects: {
    fetch: [function *({ payload }, { put, select }) {
      const { minLat, minLng, maxLat, maxLng, statistic = false } = payload;
      const user = yield select(state => state.app.user);
      yield put({ type: 'updateBounds', payload: { bounds: { minLat, minLng, maxLat, maxLng } } });
      const filter = yield select(state => state.devmap.filter);
      devService.fetch(minLat, minLng, maxLat, maxLng, filter.org, filter.sn, user.name, statistic);
    }, { type: 'takeEvery' }],
    select: [function *({ payload: { sn } }, { select, put }) {
      if (!sn) {
        return yield put({ type: 'updateSelect', payload: { select: null } });
      }
      const markers = yield select(state => state.devmap.markers);
      const dev = markers.find(marker => marker.sn === sn);
      yield put({ type: 'updateSelect', payload: { select: dev } });
    }, { type: 'takeLatest' }],
    *merge({ payload: { data: { devs, total, online } } }, { select, put }) {
      if (total !== undefined) {
        yield put({ type: 'updateStatistic', payload: { statistic: { total, online } } });
      }
      const store = yield select(state => state.devmap.devs);
      const add = [];
      const update = [];
      devs.forEach((dev) => {
        const find = store.find(ed => ed.sn === dev.sn);
        if (find) {
          if (find.lat !== dev.lat
            || find.lng !== dev.lng
            || find.online !== dev.online
            || find.master !== dev.master
            || find.type !== dev.type) {
            update.push({ find, dev });
          }
        } else {
          add.push(dev);
        }
      });
      if (update.length === 0 && add.length === 0) {
        return yield put({ type: 'calMarkers' });
      }
      const data = [...store];
      for (const dev of update) {
        const index = data.findIndex(ed => ed.sn === dev.sn);
        data[index] = dev;
      }
      for (const dev of add) {
        data.push(dev);
      }
      yield put({ type: 'updateDevs', payload: { devs: data } });
      yield put({ type: 'calMarkers' });
    },
    *calMarkers(action, { select, put }) {
      const devmap = yield select(state => state.devmap);
      const { devs, markers, bounds: { minLat, minLng, maxLat, maxLng } } = devmap;
      const { filter: { org, sn, status } } = devmap;
      let mapdevs = devs.filter((dev) => {
        if (org && dev.org !== org) {
          return false;
        }
        if (sn && dev.sn.indexOf(sn) < 0) {
          return false;
        }
        if (status === ALL) {
          return true;
        }
        if (status === ON && !dev.online) {
          return false;
        }
        if (status === OFF && dev.online) {
          return false;
        }
        return true;
      });
      if (devs.length > MAX_MARKERSIZE) {
        mapdevs = devs.filter(({ lat, lng }) => {
          return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
        });
      }
      if (mapdevs.length !== markers.length) {
        return yield put({ type: 'updateMarkers', payload: { markers: mapdevs } });
      }
      const devsns = mapdevs.map(dev => dev.sn).join('');
      const markersns = markers.map(dev => dev.sn).join('');
      if (devsns !== markersns) {
        return yield put({ type: 'updateMarkers', payload: { markers: mapdevs } });
      }
    },
    *statistic({ payload: { status } }, { select, put }) {
      const filter = yield select(state => state.devmap.filter);
      yield put({ type: 'updateFilter', payload: { filter: { ...filter, status } } });
      yield put({ type: 'calMarkers' });
    },
    *query({ payload: { sn, org } }, { select, put }) {
      const filter = yield select(state => state.devmap.filter);
      const bounds = yield select(state => state.devmap.bounds);
      yield put({ type: 'updateFilter', payload: { filter: { ...filter, org, sn } } });
      return yield put({ type: 'fetch', payload: { ...bounds, statistic: true } });
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      devService.listenFetch((data) => {
        dispatch({ type: 'merge', payload: { data } });
      });
    },
  },
};

