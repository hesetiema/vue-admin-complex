import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/search/user',
    method: 'get',
    params: { name }
  })
}

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
