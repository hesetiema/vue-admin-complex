import { param2Obj } from '@/utils'

const usermap = {
  admin: {
    token: 'admin-token',
    pass: '123456',
    introduction: 'I am a super administrator',
    name: 'Super Admin',
    roles: ['admin'],
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  },
  developer: {
    token: 'editor-token',
    pass: '654321',
    introduction: 'I am an editor',
    name: 'Normal Editor',
    roles: ['editor'],
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',

  }
}

export default {
  login: config => {
    const { username, password } = JSON.parse(config.body)
    if (username === 'admin' || username === 'editor') {
      if (usermap[username].pass === password) {
        return usermap[username].token
      } else {
        return 'Password is incorrect.'
      }
    }
    return 'No your account.'
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    let info = 'Login failed, unable to get user details.'
    for (let key in usermap) {
      if (usermap[key].token === token) {
        info = usermap[key]
        break;
      }
    }
    return info

  },
  logout: () => 'success'
}