import api from '../../api/index'
import apiConfig from '../../config/apiConfig'

// 获取第三方订单
export const prescriptionList = (id, cb) => {
  const resUrl = `${apiConfig.THIRDURL}/api/mall/continue/order/list/${id}`
  wx.request({
    url: resUrl,
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: res => {
      cb && cb(res.data)
    }
  })
}


export const addDemandList = params => {
  return new Promise((reslove, reject) => {
    api.addDemand({
      data: params,
      success: res => {
        reslove(res)
      },
      fail: error => {
        reject(error)
      }
    })
  })
}
