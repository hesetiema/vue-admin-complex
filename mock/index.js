import Mock from 'mockjs'

import user from './user'
import search from './remote-search'

Mock.setup({
  timeout: '300-600'
})

Mock.XHR.prototype.withCredentials = true;

Mock.mock(/\/user\/login/, 'post', user.login)
Mock.mock(/\/user\/getInfo/, 'get', user.getUserInfo)
Mock.mock(/\/user\/logout/, 'post', user.logout)
Mock.mock(/\/transaction\/list/,'get',search.getTransactionList)

export default Mock