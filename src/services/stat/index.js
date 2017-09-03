import { request } from 'utils';

export async function fetch(params) {
  return request({
    url: '/alarm/statistics',
    data: params,
  });
}

