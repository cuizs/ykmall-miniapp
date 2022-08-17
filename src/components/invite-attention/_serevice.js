import api from '../../api/index'
import um from '../../manager/userInfo'

export const decryptMobile = (params, cb) => {
  api.decryptMobile({
    loading: true,
    data: params,
    success: res => {
      um.update({ mobile: res.data.phoneNumber })
      wx.$showToast({ title: '您已成为会员' })

      cb && cb()
    }
  })
}
