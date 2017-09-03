import { request } from 'utils';

export async function login(params) {
  return request({
    url: '/user/login',
    method: 'post',
    data: params,
  });
}

export async function logout(params) {
  return request({
    url: '/user/logout',
    method: 'get',
    data: params,
  });
}

export async function query(params) {
  return request({
    url: '/user',
    method: 'get',
    data: params,
  });
}
