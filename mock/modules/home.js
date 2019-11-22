export function goHome () {
  return {
    // isOpen: false,
    url: 'http://localhost:8080/home',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0,
      'data': {
        'token': '4344323121398'
      }
    }
  }
}