/**
 * 网络请求处理
 */
import api from '../../api/index'

// 获取用药人信息疾病史配置
export const getDoctors = (pamras, cb) => {
  api.getDoctors({
    loading: false,
    data: pamras,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}
