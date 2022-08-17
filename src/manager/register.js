/**
 * 注册管理
 */
import um from '../manager/userInfo'
import { getCurrentPage } from '../utils/util'

const REGISTER_ROUTE = 'pages/register/register'

class RegisterIntercepter {
  constructor() {}

  action() {
    const route = getCurrentPage() ? getCurrentPage()['route'] : ''
    if (route === REGISTER_ROUTE) return

    um.isVip(res => {
      !res &&
        wx.showModal({
          title: '提示',
          content: '注册会员享受更多福利!',
          showCancel: false,
          confirmText: '立即注册',
          confirmColor: '#008DF9',
          success: res => {
            if (res.confirm) wx.navigateTo({ url: '/pages/register/register' })
          }
        })
    })
  }
}

export default new RegisterIntercepter()
