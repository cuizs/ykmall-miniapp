/**
 * 网络请求处理
 */
import api from '../../api/index'

export const collectGoods = (params, loading, cb) => {
  api.collectGoods({
    loading: false,
    data: params,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}
