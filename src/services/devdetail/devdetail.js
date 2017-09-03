import { request } from 'utils';

export async function fetch(sn, pageNo, pageSize) {
  return request({
    url: '/rpc/list',
    data: { sn, pageNo, pageSize },
  });
}
