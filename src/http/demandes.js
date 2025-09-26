import request from './request'


export function definePriceDemande(data) {
  return request({
    url: 'demandeservice/define/price/',
    method: 'post',
    data
  })
}

export function saveDemandePaiement(data) {
  return request({
    url: 'demandeservice/save/payment/',
    method: 'post',
    data
  })
}

export function getDemande(id) {
  return request({
    url: 'demandeservice/' + id,
    method: 'get'
  })
}
