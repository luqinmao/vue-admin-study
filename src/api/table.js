import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/home/advertise/list',
    method: 'get',
    params
  })
}
