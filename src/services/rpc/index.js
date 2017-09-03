import { request } from 'utils';

export async function fetch(filter, pageNo, pageSize) {
  return request({
    url: '/rpc/list',
    data: {
      ...filter,
      pageNo,
      pageSize,
    },
  });
}
