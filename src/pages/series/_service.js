/**
 * 网络请求
 */
import api from '../../api/index'

export const getCmsByType = (type, loading, cb) => {
  api.getCmsByType(type, {
    loading: false,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}
