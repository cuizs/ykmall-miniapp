/**
 * 网络请求处理
 */
import api from '../../api/index'

export const getCategoryList = (loading = false, cb) => {
  api.getCategoryList({
    loading: loading,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}
