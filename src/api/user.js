import request from '@/utils/request'

export function createUser(data){
  return request({
    url:'/users',
    method:'post',
    data
  })
}

export function getUserList(){
  return request({
    url:'/users',
    method:'get'
  })
}

export function deleteUser(username){
  return request({
    url:`/users/${username}`,
    method:'delete',
  })
}

export function login(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/users/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/users/logout',
    method: 'post'
  })
}

