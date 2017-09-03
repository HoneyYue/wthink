import { request } from 'utils';

export async function fetch(filter, pageNo, pageSize) {
  return request({
    url: '/iso/list',
    data: {
      ...filter,
      pageNo,
      pageSize,
    },
  });
}

export async function upSwitch(type, id, up) {
  return request({
    url: '/iso/switch',
    data: { type, id, up },
  });
}

export async function del(id) {
  return request({
    url: '/iso/del',
    data: { id },
  });
}

export async function group(onlineOnlie) {
  return request({
    url: '/iso/group',
    data: { onlineOnlie },
  });
}
