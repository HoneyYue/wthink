import { request } from 'utils';

export async function fetch(filter, pageNo, pageSize) {
  return request({
    url: '/dev/list',
    data: {
      ...filter,
      pageNo,
      pageSize,
    },
  });
}

export async function add(params) {
  return request({
    url: '/dev/add',
    data: params,
  });
}

export async function edit(params) {
  return request({
    url: '/dev/edit',
    data: params,
  });
}

export async function del(params) {
  return request({
    url: '/dev/del',
    data: params,
  });
}
