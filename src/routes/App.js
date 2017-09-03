import React from 'react';
import { connect } from 'dva';
import NProgress from 'nprogress';
// import pathToRegexp from 'path-to-regexp';

import { openPages } from 'config';
import { Loader, Layout } from 'components';
import { classnames } from 'utils';

import Error from './error';

import '../themes/index.less';
import './app.less';

const { Header, Bread, Footer, Sider, styles } = Layout;
let lastHref;

function IndexPage({ dispatch, children, location, loading, app }) {
  const href = window.location.href;
  if (lastHref !== href) {
    NProgress.start();
    if (!loading.global) {
      NProgress.done();
      lastHref = href;
    }
  }
  const { pathname } = location;
  if (openPages && openPages.includes(pathname)) {
    return (
      <div>
        <Loader spinning={loading.effects['app/query']} />
        { children }
      </div>
    );
  }
  const {
    user,
    siderFold,
    darkTheme,
    isNavbar,
    menuPopoverVisible,
    navOpenKeys,
    menu,
    // permissions,
  } = app;
  // const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  // const current = menu.filter(item => pathToRegexp(item.route || '').exec(path));
  // const hasPermission = current.length ? permissions.visit.includes(current[0].id) : false;
  const hasPermission = true;

  const headerProps = {
    menu,
    user,
    siderFold,
    isNavbar,
    menuPopoverVisible,
    navOpenKeys,
    switchMenuPopover: () => {
      dispatch({ type: 'app/switchMenuPopver' });
    },
    logout: () => {
      dispatch({ type: 'app/logout' });
    },
    switchSider: () => {
      dispatch({ type: 'app/switchSider' });
    },
    changeOpenKeys: (openKeys) => {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } });
    },
  };

  const siderProps = {
    menu,
    siderFold,
    darkTheme,
    navOpenKeys,
    changeTheme: () => {
      dispatch({ type: 'app/switchTheme' });
    },
    changeOpenKeys: (openKeys) => {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } });
    },
  };

  const breadProps = {
    menu,
  };
  return (
    <div
      className={classnames(
      styles.layout,
      { [styles.fold]: isNavbar ? false : siderFold },
      { [styles.withnavbar]: isNavbar },
      )}
    >
      <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
        <Sider {...siderProps} />
      </aside>
      <div className={styles.main}>
        <Header {...headerProps} />
        <Bread {...breadProps} />
        <div className={styles.container}>
          <div className={styles.content}>
            <Loader spinning={loading.effects['app/query']} />
            {hasPermission ? children : <Error />}
          </div>
        </div>
        <Footer />
      </div>
    </div>
    // <div className={styles.normal}>
    //   <Loader spinning={loading.effects['app/query']} />
    //   {children}
    // </div>
  );
}

IndexPage.propTypes = {};

function mapStateToProps(state) {
  const { loading, app } = state;
  return {
    loading,
    app,
  };
}

export default connect(mapStateToProps)(IndexPage);
