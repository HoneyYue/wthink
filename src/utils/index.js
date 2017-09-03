import classnames from 'classnames';
import { message } from 'antd';

import request from './request';
import config from './config';

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null;
  }
  const item = array.filter(_ => _[keyAlias] === key);
  if (item.length) {
    return item[0];
  }
  return null;
};

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  const data = [...array];
  const result = [];
  const hash = {};
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index];
  });

  data.forEach((item) => {
    const hashVP = hash[item[pid]];
    if (hashVP) {
      if (!hashVP[children]) {
        hashVP[children] = [];
      }
      hashVP[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
};

const errormsg = (msg, target) => {
  if (target) {
    message.config({
      getContainer: () => target,
    });
  }
  message.error(msg, 3, () => {
    message.config({
      getContainer: () => document.body,
    });
  });
};

const findPathBFS = (source, search, id = 'id', children = 'children') => {
  const res = [];
  source.forEach((item) => {
    res.push(item);
  });
  for (let i = 0; i < res.length; i += 1) {
    const curData = res[i];
    if (curData[id] === search) {
      return curData;
    }
    if (curData.children) {
      res.push(...curData[children]);
    }
  }
  return null;
};

const treeMap = (source, map, children = 'children') => {
  const res = [];
  source.forEach((item) => {
    res.push(item);
  });
  for (let i = 0; i < res.length; i += 1) {
    const curData = res[i];

    if (curData.children) {
      res.push(...curData[children]);
    }
  }
  const list = res.map((item) => {
    return { ...item, children: null };
  }).map(map);
  return arrayToTree(list);
};

const dateTimeFormat = (time, format = 'yyyy-MM-dd HH:mm:ss') => {
  if (!time) {
    return;
  }
  const data = new Date(time);
  const o = {
    'M+': data.getMonth() + 1,
    'd+': data.getDate(),
    'h+': data.getHours(),
    'H+': data.getHours(),
    'm+': data.getMinutes(),
    's+': data.getSeconds(),
    'q+': Math.floor((data.getMonth() + 3) / 3),
    S: data.getMilliseconds(),
  };
  let result;
  if (/(y+)/.test(format)) {
    result = format.replace(RegExp.$1, `${data.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      result = result.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length));
    }
  }
  return result;
};

module.exports = {
  request,
  config,
  classnames,
  arrayToTree,
  queryArray,
  queryTree: findPathBFS,
  treeMap,
  errormsg,
  dateTimeFormat,
};
