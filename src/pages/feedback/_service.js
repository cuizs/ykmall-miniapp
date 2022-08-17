
import api from '../../api/index'

export const feedback = (params, cb) => {
  api.feedback({
    loading: true,
    data: params,
    success: res => {
      cb && cb(res)
    }
  })
}