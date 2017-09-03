import { request } from 'utils';

export async function fetch(filter, pageNo, pageSize) {
  return request({
    url: '/org/list',
    data: {
      ...filter,
      pageNo,
      pageSize,
    },
  });
}

export async function add(params) {
  return request({
    url: '/org/add',
    data: params,
  });
}

export async function edit(params) {
  return request({
    url: '/org/edit',
    data: params,
  });
}

export async function del(id) {
  return request({
    url: '/org/del',
    data: { id },
  });
}
