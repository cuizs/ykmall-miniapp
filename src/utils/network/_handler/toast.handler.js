import { silentErrorCode } from '../../../constant/ignoreError'

/**
 * 加载, 提示统一处理
 */

// 显示加载
export const showLoading = () => {
  wx.showLoading({
    mask: true,
    title: '加载中...'
  })
}

// 隐藏加载
export const hideLoading = () => {
  setTimeout(() => {
    wx.hideLoading()
  }, 0)
}

// 显示提示
export const showToast = errorStruct => {
  // 判断是否是静默错误类型
  if (silentErrorCode.some(code => code === errorStruct.code)) return

  setTimeout(() => {
    wx.showToast({
      title: errorStruct.errMsg || '网络异常，请稍后再试',
      icon: 'none',
      duration: 2000
    })
  }, 500)
}
