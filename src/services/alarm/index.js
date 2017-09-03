import { request } from 'utils';

export async function fetch(filter, pageNo, pageSize) {
  return request({
    url: '/alarm/list',
    data: {
      ...filter,
      pageNo,
      pageSize,
    },
  });
}

export async function queryNotCleanBySn(sn) {
  return request({
    url: '/alarm/queryNotCleanBySn',
    data: {
      sn,
    },
  });
}

export async function queryByIds(ids) {
  return request({
    url: '/alarm/queryByIds',
    data: {
      ids,
    },
  });
}

export async function queryHistory(sn, pageNo, pageSize) {
  return request({
    url: '/alarm/queryHistory',
    data: {
      sn,
      pageNo,
      pageSize,
    },
  });
}

export async function queryExistsBySnTime(sn, time) {
  return request({
    url: '/alarm/queryExistsBySnTime',
    data: {
      sn,
      time,
    },
  });
}
