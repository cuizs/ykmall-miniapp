/**
 * banner跳转
 *
 * MA_PAGE -> 小程序内部
 * EXT_MA_PAGE -> 其他小程序
 */

// 需要特殊跳转处理的页面
const SPECIAL_PATH = ['pages/home/home', 'pages/category/category','pages/bill/bill', 'pages/cart/cart', 'pages/mine/mine']

const UTIL = {
  // 判断是否跳转到特殊页面
  isSpecialPath(path) {
    let result = false
    for (const specialPath of SPECIAL_PATH) {
      if (path.indexOf(specialPath) > -1) {
        result = true
        break
      }
    }
    return result
  },

  // 解析url参数
  parseUrlParams(path) {
    const urlParams = path.split('?')[1]
    if (!urlParams) {
      return null
    }
    const result = {}
    const paramArray = urlParams.split('&')
    for (const item of paramArray) {
      const valueArray = item.split('=')
      result[valueArray[0]] = valueArray[1]
    }
    return result
  }
}

export const navigateByInfo = objc => {
  const type = objc.actionType
  switch (type) {
    case 'MA_PAGE': {
      const isSpecial = UTIL.isSpecialPath(objc.actionUrl)
      if (isSpecial) {
        const params = UTIL.parseUrlParams(objc.actionUrl)
        if (params) {
          wx.setStorageSync('routerQuery', params)
        }
        wx.switchTab({
          url: `/${objc.actionUrl}`
        })
      } else {
        wx.navigateTo({
          url: `/${objc.actionUrl}`
        })
      }
      break
    }
    case 'EXT_MA_PAGE': {
      wx.navigateToMiniProgram({
        appId: objc.appId,
        path: objc.actionUrl
      })
      break
    }
    case 'NORMAL': {
      break
    }
    default: {
      console.warn(`请确认 ${type} 跳转类型是否存在`)
    }
  }
}
