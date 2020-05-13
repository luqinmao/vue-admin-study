import request from '@/utils/request'
const baseURL = 'http://localhost:8888'

export function login(data) {
  return request({
    url: `${baseURL}/admin/login`,
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `${baseURL}/admin/info`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: `${baseURL}/admin/logout`,
    method: 'post'
  })
}
