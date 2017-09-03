import { request } from 'utils';

export async function fetch(filter, pageNo, pageSize) {
  return request({
    url: '/camera/list',
    data: {
      ...filter,
      pageNo,
      pageSize,
    },
  });
}

export async function add(params) {
  return request({
    url: '/camera/add',
    data: params,
  });
}

export async function edit(params) {
  return request({
    url: '/camera/edit',
    data: params,
  });
}

export async function del(id) {
  return request({
    url: '/camera/del',
    data: { id },
  });
}
