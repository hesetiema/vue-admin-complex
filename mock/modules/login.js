export function login () {
  return {
    // isOpen: false,
    url: 'http://localhost:8080/login',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'data': {
        'token': '123456'
        // 其他数据
      }
    }
  }
}