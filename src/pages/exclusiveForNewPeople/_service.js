/**
 * 网络请求处理
 */
import api from '../../api/index'

// 获取公益低价药列表
export const getCampaign = (pamras, cb) => {
  api.getCampaign({
    loading: false,
    data: pamras,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}
