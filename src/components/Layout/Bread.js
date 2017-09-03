import React from 'react';
import PropTypes from 'prop-types';
import pathToRegexp from 'path-to-regexp';
import { Breadcrumb, Icon, Card } from 'antd';
import { queryArray } from 'utils';

import { Link } from 'dva/router';
// import styles from './Bread.less';

const Bread = ({ menu }) => {
  // 匹配当前路由
  const pathArray = [];
  let current;
  for (const index in menu) {
    if (menu[index].route && pathToRegexp(menu[index].route).exec(location.pathname)) {
      current = menu[index];
      break;
    }
  }

  const getPathArray = (item) => {
    if (!item) {
      return;
    }
    pathArray.unshift(item);
    if (item.pid) {
      getPathArray(queryArray(menu, String(item.pid), 'id'));
    }
  };

  if (!current) {
    pathArray.push(menu[0] || {
      id: 1,
      icon: 'laptop',
      name: '首页',
    });
    pathArray.push({
      id: 404,
      name: 'Not Found',
    });
  } else {
    getPathArray(current);
  }

  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (
      <span>{item.icon
          ? <Icon type={item.icon} style={{ marginRight: 4 }} />
          : ''}{item.name}</span>
    );
    return (
      <Breadcrumb.Item key={key}>
        {((pathArray.length - 1) !== key)
          ? <Link to={item.route}>
            {content}
          </Link>
          : content}
      </Breadcrumb.Item>
    );
  });

  const renderCrumb = () => {
    return (
      <Breadcrumb>
        {breads}
      </Breadcrumb>
    );
  };
  return (
    <Card
      title={pathArray[pathArray.length - 1].name}
      style={{ marginTop: 5, marginLeft: 2 }}
      bordered={false}
      noHovering
      extra={renderCrumb()}
      bodyStyle={{ padding: 0 }}
    />
  );
  // return (
  //   <div className={styles.bread}>
  //     <Breadcrumb>
  //       {breads}
  //     </Breadcrumb>
  //   </div>
  // );
};

Bread.propTypes = {
  menu: PropTypes.array,
};

export default Bread;
