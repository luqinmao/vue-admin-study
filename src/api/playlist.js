import request from '@/utils/request'
const baseURL = 'http://localhost:8888'

export function fetchList(params) {
    return request({
        params,
        url: `${baseURL}/home/advertise/list`,
        method: 'get'
    })
}
export function fetchById(id) {
    return request({
        url: `${baseURL}/home/advertise/${id}`,
        method: 'get',
    })
}

export function create(params) {
  return request({
    url: `${baseURL}/home/advertise/create`,
    data: {
      ...params
    },
    method: 'post',
  })
}


export function update(id,params) {
    return request({
        url: `${baseURL}/home/advertise/update/${id}`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function del(ids) {
    return request({
      params: {
        ids: ids
      },
        url: `${baseURL}/home/advertise/delete`,
        method: 'post',
    })
}
