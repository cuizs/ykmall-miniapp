/**
 * 网络请求处理
 */
import api from '../../api/index'

export const getCategoryList = (cb) => {
  api.getCategoryList({
    success: res => {
      cb && cb(res.data || [])
    }
  })
}
