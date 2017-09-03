import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'dva/router';
import App from './routes/App';

const registerModel = (app, model) => {
  const modelNames = '_models';
  const models = app[modelNames].filter(m => m.namespace === model.namespace);
  if (models.length !== 1) {
    app.model(model);
  }
};

const Routers = ({ history, app }) => {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, { component: require('./routes/dashboard') });
        }, 'dashboard');
      },
      childRoutes: [
        {
          path: 'login',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/login'));
            }, 'user');
          },
        },
        {
          path: 'dashboard',
          getIndexRoute(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, { component: require('./routes/dashboard') });
            }, 'dashboard');
          },
        },
        // {
        //   path: 'users',
        //   getComponent(nextState, cb) {
        //     require.ensure([], (require) => {
        //       registerModel(app, require('./models/user'));
        //       cb(null, require('./routes/user/Test'));
        //     }, 'user');
        //   },
        // },
        {
          path: 'map',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/dev/devmap'));
              registerModel(app, require('./models/devdetail/detail'));
              registerModel(app, require('./models/dev/slot'));
              cb(null, require('./routes/map'));
            }, 'map');
          },
        }, {
          path: 'org',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/org'));
            }, 'map');
          },
        }, {
          path: 'camera',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/camera'));
              cb(null, require('./routes/camera/List'));
            }, 'camera');
          },
        }, {
          path: 'dev',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/dev/dev'));
              registerModel(app, require('./models/dev/alarm'));
              registerModel(app, require('./models/dev/slot'));
              cb(null, require('./routes/dev/List'));
            }, 'dev');
          },
        }, {
          path: 'iso',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/iso'));
              registerModel(app, require('./models/iso/upgrade'));
              cb(null, require('./routes/iso/List'));
            }, 'iso');
          },
        }, {
          path: 'alarm',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/alarm/list'));
              cb(null, require('./routes/alarm/List'));
            }, 'alarm');
          },
        }, {
          path: 'detail',
          getChildRoutes(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/dev/alarm'));
              registerModel(app, require('./models/alarm/list'));
              registerModel(app, require('./models/devdetail/detail'));
              registerModel(app, require('./models/dev/slot'));
              cb(null, {
                path: ':sn',
                component: require('./routes/devdetail'),
              });
            }, 'detail');
          },
        }, {
          path: 'users',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/users'));
              cb(null, require('./routes/users/List'));
            }, 'users');
          },
        }, {
          path: 'stat',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/stat'));
              registerModel(app, require('./models/alarm/list'));
              cb(null, require('./routes/stat'));
            }, 'stat');
          },
        }, {
          path: 'curdetail',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/curdetail'));
              cb(null, require('./routes/curdetail'));
            }, 'curdetail');
          },
        }, {
          path: 'rpc',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/rpc'));
              cb(null, require('./routes/rpc'));
            }, 'rpc');
          },
        }, {
          path: '*',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/error/'));
            }, 'error');
          },
        },
      ],
    },
  ];

  return <Router history={history} routes={routes} />;
};

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
};

export default Routers;
