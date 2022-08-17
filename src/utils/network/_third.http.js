// 获取第三方请求域名
import apiConfig from '../../config/apiConfig'
import MD5 from '../../plugins/third.md5'
import { showLoading, hideLoading, showToast, showModal, showNaviBarLoading, hideNaviBarLoading } from '../network/_handler/toast.handler'
import { errorHandler, createServerErrStruct } from '../network/_handler/error.handler'

// 加密KEY
const DEFAULT_ENCRYPTION_KEY = 'exiangsui2020'
// 获取认证token
const getAuthHeader = (timestamp, recipeNumber) => {
  return {
    'X-TOKEN': MD5(`${timestamp}${DEFAULT_ENCRYPTION_KEY}${recipeNumber}`)
  }
}
// 进行网络请求
const http = (objc = {}) => {
  // 是否显示加载动画
  objc.loading && showLoading()
  showNaviBarLoading()
  // url地址拼接
  const resUrl = `${apiConfig.THIRDURL}${objc.url}`

  const timestamp = new Date().getTime()
  const recipeNumber = objc.data.recipeNumber
  const authHeader = getAuthHeader(timestamp, recipeNumber)
  const data = {
    timestamp: timestamp,
    token: authHeader['X-TOKEN'],
    ...objc.data
  }
  // 获取当前时间戳
  wx.request({
    url: resUrl,
    data: data,
    method: objc.method || 'GET',
    dataType: objc.dataType || 'json',
    responseType: objc.responseType || 'text',
    header: { ...authHeader },
    success: res => {
      const { data = {} } = res
      if (data.code == 200) {
        objc.success && objc.success(res)
        return
      }
      showModal(data.message, () => {
        wx.switchTab({
          url: '/pages/home/home'
        })
      })
    },
    fail: error => {
      errorHandler(error, results => {
        const errorStruct = createServerErrStruct(results)
        showToast(errorStruct.errMsg)
        objc.fail && objc.fail(errorStruct)
      })
    },
    complete: () => {
      hideLoading()
      hideNaviBarLoading()
    }
  })
}

export default http
