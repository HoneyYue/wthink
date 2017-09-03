import { request } from 'utils';

export async function fetch(sn) {
  return request({
    url: '/dev/querydetail',
    data: {
      sn,
    },
  });
}
