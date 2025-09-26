import request from './request'

export function storeNewsletter(data) {
  return request({
    url: 'newsletter/',
    method: 'post',
    data
  })
}

export function storeContact(data) {
  return request({
    url: 'contact/',
    method: 'post',
    data
  })
}


export function getContact() {
  return request({
    url: 'contact',
    method: 'get'
  })
}

export function getNewsletter() {
  return request({
    url: 'newsletter',
    method: 'get'
  })
}

export function getTarifsService(service_id) {
  return request({
    url: 'grilletarifaire/get/service/price/' + service_id,
    method: 'get'
  })
}

export function getTarifs() {
  return request({
    url: 'grilletarifaire',
    method: 'get'
  })
}

export function getAcceuilClient() {
  return request({
    url: 'accueil/client/',
    method: 'get'
  })
}