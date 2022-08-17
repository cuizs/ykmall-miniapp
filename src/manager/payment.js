import api from '../api/index'

const sendPayment = (objc = {}) => {
  if (!objc.orderId) {
    console.warn('参数 orderId 必传')
    return
  }
  api.payOrder(objc.orderId, {
    loading: true,
    success: res => {
      const data = res.data || {}
      const payInfo = {
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.packageValue,
        signType: data.signType,
        paySign: data.paySign
      }
      wx.requestPayment({
        ...payInfo,
        success: res => {
          objc.success && objc.success(res.data || {})
        },
        fail: error => {
          objc.fail && objc.fail()
        }
      })
    }
  })
}

export default sendPayment
