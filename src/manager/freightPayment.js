import api from '../api/index'

const sendFreightPayment = (objc = {}) => {
  if (!objc.orderFreightId) {
    console.warn('参数 orderFreightId 必传')
    return
  }
  api.freightPayOrder(objc.orderFreightId, {
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

export default sendFreightPayment
