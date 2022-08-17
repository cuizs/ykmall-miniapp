import api from '../api/index'
import local from '../utils/localStorage'
const USER_INFO = '_userInfo_'
const LOCAL_TOKEN_KEY = '_token_'
const LOCAL_CHANNEL_KEY = '_channel_'

class UserInfo {
  constructor() {}

  /**
   * TOKEN
   */
  getToken() {
    return local.get(LOCAL_TOKEN_KEY)
  }

  setToken(value, expires) {
    local.set(LOCAL_TOKEN_KEY, value, expires)
  }
  // 获取当前用户所在channel
  getCurrentChannel() {
    return local.get(LOCAL_CHANNEL_KEY) ? local.get(LOCAL_CHANNEL_KEY) : null
  }

  getChannelASync() {
    let TIMER = null;
    return new Promise((reslove)=> {
      let channelInfo = this.getCurrentChannel()
      if (channelInfo) {
        reslove(channelInfo)
      } else {
        TIMER = setInterval(() => {
          let channel = this.getCurrentChannel()
          if(channel){
            clearInterval(TIMER);
            TIMER = null;
            reslove(channel);
          }
        }, 500);
      }
    })
  }

  // 设置用户当前渠道
  setCurrentChannel(value) {
    local.set(LOCAL_CHANNEL_KEY, value);
  }
  // 清空用户登录信息
  clearAllUserInfo() {
    local.set(LOCAL_TOKEN_KEY, '');
    local.set(USER_INFO, '');
  }

  /**
   * USERINFO
   */
  isVip(cb) {
    this.getUserInfo().then(userInfo => {
      cb && cb(!!userInfo.mobile)
    })
  }

  setUserInfo(value) {
    const userInfo = local.get(USER_INFO) || {}
    local.set(USER_INFO, Object.assign(userInfo, value))
    return local.get(USER_INFO) || {}
  }

  getUserInfo() {
    return new Promise(reslove => {
      const userInfo = local.get(USER_INFO)
      if (userInfo) {
        reslove(userInfo)
      } else {
        api.getUserInfo({
          success: res => {
            const userInfo = res.data
            this.setUserInfo(userInfo)
            reslove(userInfo)
          }
        })
      }
    })
  }

  refresh(force = true) {
    return new Promise(reslove => {
      if (force) {
        api.getUserInfo({
          success: res => {
            const userInfo = res.data
            this.setUserInfo(userInfo)
            reslove(userInfo)
          }
        })
      }

      if (!force) {
        if (local.get(USER_INFO)) return

        api.getUserInfo({
          success: res => {
            const userInfo = res.data
            this.setUserInfo(userInfo)
            reslove(userInfo)
          }
        })
      }
    })
  }
  // 获取
  get(cb) {
    const userInfo = local.get(USER_INFO)
    if (!userInfo) {
      UserInfo.getUserInfo(data => {
        cb && cb(data)
      })
      return
    }
    cb && cb(userInfo)
  }

  // 设置
  set(value) {
    local.set(USER_INFO, value)
  }

  // 更新
  update(value) {
    const userInfo = local.get(USER_INFO) || {}

    const assignUserInfo = Object.assign(userInfo, value)
    local.set(USER_INFO, assignUserInfo)

    return assignUserInfo
  }

  // 刷新
  refresh(cb) {
    UserInfo.getUserInfo(data => {
      cb && cb(data)
    })
  }

  // 身份检查器
  identityViewer() {
    const identity = {}
    const userInfo = local.get(USER_INFO)
    if (!userInfo) {
      console.warn('本地缓存中不存在用户信息')
      return
    }

    identity['isMember'] = userInfo.level === 'Vip'

    identity['isAgent'] = userInfo.customerType === 'Doctor'

    return identity
  }

  static getUserInfo(cb) {
    api.getUserInfo({
      loading: false,
      success: res => {
        // 存入本地
        local.set(USER_INFO, res.data)
        // 进行回调
        cb && cb(res.data)
      }
    })
  }
}

export default new UserInfo()
