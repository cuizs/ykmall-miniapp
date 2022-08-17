/**
 * 网络请求处理
 */
import api from '../../api/index'


export const getPageDetail = (type, cb, fail) => {
  api.getCampaignPage(type, {
    success: res => {
      cb && cb(res.data || [])
    },
    fail: res => {
      fail && fail()
    }
  })
}