/**
 * 网络请求处理
 */
import api from '../../api/index'
 
// 获取地区
export const areaList = (cb) => {
  api.getAreaList({
    loading: false,
    success: res => {
      cb && cb(res.data)
    }
  })
}

// 查看是否为推广人
export const checkPromoter = (pamras,cb) => {
  api.checkPromoter({
    loading: false,
    data: pamras,
    success: res => {
      cb && cb(res.data)
    }
  })
}

// 注册成为推广人
export const registerPromoterApi = (pamras,cb) => {
  api.registerPromoter({
    loading: false,
    data: pamras,
    success: res => {
      cb && cb(res)
    }
  })
}
// 查看用户信息
export const userInfo = (cb) => {
  api.getUserInfo({
    loading: false,
    success: res => {
      cb && cb(res.data)
    }
  })
}

