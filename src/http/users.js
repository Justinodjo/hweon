import request from './request'

export function storeUser(data) {
  return request({
    url: 'users/',
    method: 'post',
    data
  })
}

export function getUsers() {
  return request({
    url: 'users/',
    method: 'get'
  })
}


export function deleteUser(id) {
  return request({
    url: 'users/' + id,
    method: 'delete'
  })
}

export function updateUser(id) {
  return request({
    url: 'users/' + id,
    method: 'get'
  })
}
