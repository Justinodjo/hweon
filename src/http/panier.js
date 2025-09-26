import request from "./request";

export function getPanier() {
  return request({
    url: "panier/",
    method: "get",
  });
}

export function addPanier() {
  return request({
    url: "panier/",
    method: "post",
  });
}

export function addItem(data) {
  return request({
    url: "panier/add/item/document/",
    method: "post",
    data,
  });
}

export function removeItem(data) {
  return request({
    url: "panier/remove/item/",
    method: "post",
    data,
  });
}


export function paiementProceed(data) {
  return request({
    url: "paiement/",
    method: "post",
    data,
  });
}