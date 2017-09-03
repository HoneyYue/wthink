import { request } from '../utils';

export async function fetch(filter, pageNo, pageSize) {
  return request({
    url: '/user/list',
    data: {
      ...filter,
      pageNo,
      pageSize,
    },
  });
}

export async function add(params) {
  return request({
    url: '/user/add',
    data: params,
  });
}

export async function edit(params) {
  return request({
    url: '/user/edit',
    data: params,
  });
}

export async function del(id) {
  return request({
    url: '/user/del',
    data: { id },
  });
}

export async function reset(id) {
  return request({
    url: '/user/resetpwd',
    data: { id },
  });
}
