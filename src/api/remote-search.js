import request from '@/utils/request'

export function transactionsList(){
  return request({
    url:'rest/transactions',
    method:'get',
  })
}

export function createTransaction(data){
  return request({
    url:'rest/transactions',
    method:'post',
    data
  })
}

export function getTransaction(id){
  return request({
    url:`rest/transactions/${id}`,
    method:'get',
  })
}

export function updateTransaction(id,data){
  return request({
    url:`rest/transactions/${id}`,
    method:'put',
    data
  })
}

export function deleteTransaction(id){
  return request({
    url:`rest/transactions/${id}`,
    method:'delete',
  })
}
