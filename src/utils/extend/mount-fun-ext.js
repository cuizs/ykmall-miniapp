/**
 * 方法扩展 封装 挂载
 **/
import local from '../localStorage'


// 提示
wx._showToast = (objc = {}) => {
  wx.showToast({
    ...objc,
    icon: 'none',
    mask: true,
    duration: 1800
  })
}

// 加载
wx._showLoading = (objc = {}) => {
  wx.showLoading({
    ...objc,
    mask: true
  })
}

// 用于解密用户信息
wx._getEncryptedData = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: loginRes => {
        wx.getUserInfo({
          success: userInfoRes => {
            let objc = {
              encryptedData: userInfoRes.encryptedData,
              iv: userInfoRes.iv,
              jsCode: loginRes.code
            }
            resolve(objc)
          },
          fail: error => {
            reject(error)
          }
        })
      }
    })
  })
}

// 获取用户通讯地址
wx._getAuthAddress = () => {
  const AUTH_ADDRESS_KEY = 'REJECT_AUTH_ADDRESS'
  const getWxAddress = function (cb) {
    wx.chooseAddress({
      success: res => {
        local.set(AUTH_ADDRESS_KEY, false)
        cb && cb(res)
      },
      fail: () => {
        local.set(AUTH_ADDRESS_KEY, true)
      }
    })
  }
  return new Promise(resolve => {
    const rejectAuth = local.get(AUTH_ADDRESS_KEY)
    if (rejectAuth) {
      wx.openSetting({
        success: res => {
          // 小程序原生的本地存储存在问题
          getWxAddress(res => {
            resolve(res)
          })
        }
      })
    } else {
      getWxAddress(res => {
        resolve(res)
      })
    }
  })
}
