import request from './request'

export function searchOne(id) {
  return request({
    url: `entreprise/${id}`,
    method: 'get'
  })
}

export function searchRequestGlobal(data) {
  return request({
    url: "entreprise/search/list/",
    method: 'post',
    data
  })
}

export function searchEntrepriseByName(data) {
  return request({
    url: "entreprise/search/name/exactly/",
    method: 'post',
    data
  })
}


export function resultEntreprisesFilter(data) {
  return request({
    url: "entreprise/search/filter/",
    method: 'POST',
    data
  })
}

export function storeServiceRequest(data) {
  return request({
    url: "demandeservice/",
    method: 'POST',
    data
  })
}

export function fetchServiceRequest() {
  return request({
    url: "demandeservice/",
    method: 'GET',
  })
}