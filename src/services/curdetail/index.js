import { request } from 'utils';

export async function fetch(param) {
  return request({
    url: '/dev/online/statistics',
    data: param,

  });
}
