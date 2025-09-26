import request from './request'

export function login(data) {
  return request({
    url: 'token/',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: 'register/',
    method: 'post',
    data
  })
}

export function verifyOTP(data) {
  return request({
    url: 'register/verify-otp/',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: 'users/me',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'logout',
    method: 'post'
  })
}
