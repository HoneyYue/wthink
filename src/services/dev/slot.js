import { request } from 'utils';

export async function queryBySn(sn) {
  return request({
    url: '/devslot/queryBySn',
    data: {
      sn,
    },
  });
}

export async function update(sn, slots) {
  return request({
    url: '/devslot/edit',
    data: {
      sn,
      slots,
    },
  });
}
