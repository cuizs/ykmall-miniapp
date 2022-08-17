/**
 * 扩展Page注册
 */
import rim from '../../mixins/register'
import imgThumConfig from '../../config/imgThumConfig'
import { debounce, isIpx, getCurrentPage } from '../util'

let OriginPage = Page,
  hooks = [
    'onLoad',
    'onReady',
    'onShow',
    'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onShareAppMessage',
    'onPageScroll',
    'onTabItemTap'
  ]

class NewPage {
  constructor(options) {
    const opts = {
      mixins: [],
      ...options
    }

    opts.mixins = [...opts.mixins]

    // 进行混合器合并
    for (let mixin of opts.mixins) {
      if (!mixin || typeof mixin !== 'object') continue
      // 合并混合器中的data
      if (mixin.data && typeof mixin.data === 'object') {
        opts.data = {
          ...mixin.data,
          ...opts.data,
          isIpx: isIpx()
        }
      }

      for (let key in mixin) {
        // 合并混合器中自定义 方法/属性
        if (!~hooks.indexOf(key)) {
          opts[key] = opts[key] || mixin[key]
          continue
        }
        // 合并混合器中的生命钩子方法
        const originHook = opts[key] || function () {}
        opts[key] = function () {
          if (typeof mixin[key] !== 'function') {
            console.warn(`page hook '${key}' must be a function.`)
          } else {
            originHook.apply(this, arguments)
            mixin[key].apply(this, arguments)
          }
        }
      }
    }

    // 图片缩略比例
    opts.data['imgThumConfig'] = imgThumConfig

    // 挂载公共方法
    opts.$go = this._go
    opts.$to = this._to
    opts.$initLoading = this._initLoading
    opts.$showLoading = this._showLoading
    opts.$hideLoading = this._hideLoading
    opts.$setRouterQuery = this._setRouterQuery
    opts.$getRouterQuery = this._getRouterQuery

    return OriginPage(opts)
  }

  // 本地set路由参数
  _setRouterQuery(objc = {}) {
    if (!objc.key || !objc.query) return
    wx.setStorageSync(objc.key, objc.query)
  }
  // 本地get路由参数
  _getRouterQuery(key) {
    let query = null
    // 强制key值获取
    if (key) {
      query = wx.getStorageSync(key)
      wx.removeStorageSync(key)
    } else {
      let curRouter = getCurrentPage().route
      query = wx.getStorageSync(curRouter)
      wx.removeStorageSync(curRouter)
    }
    return query
  }

  // 应用于html中跳转
  _go(event) {
    const path = event.currentTarget.dataset.path
    const type = event.currentTarget.dataset.type || 'navigate'
    this.$to(path, type)
  }

  // 应用于js中跳转
  _to(path, type = 'navigate') {
    // 使手机发生较短时间的振动
    wx.vibrateShort()

    let routes = getCurrentPages(),
      refer = routes[routes.length - 1].route,
      route = path.split('?')[0],
      query = path.split('?')[1],
      key = `pages/${route}`,
      params = query,
      data = {}

    if (params) {
      params.split('&').forEach(item => {
        let key = item.split('=')[0],
          value = item.split('=')[1]
        data[key] = value
      })
    }

    switch (type) {
      case 'navigate':
        if (routes.length >= 10) {
          type = 'redirectTo'
        } else {
          type = 'navigateTo'
        }
        break
      case 'redirect':
        type = 'redirectTo'
        break
      case 'switchTab':
        type = 'switchTab'
        break
      case 'reLaunch':
        type = 'reLaunch'
        break
      case 'navigateBack':
        type = ''
        wx.navigateBack({
          delta: 1
        })
        break
    }
    if (type) {
      debounce(function () {
        wx[type]({
          url: `/pages/${path}`,
          success: res => {
            console.log(`<------ ${type} to '${path}' success-------->`)
          },
          fail: error => {
            console.log(`<------ ${type} to '${path}' fail-------->`)
          }
        })
      }, 300)()
    }
  }
  /**
   * 页面加载组件
   */
  _initLoading(el) {
    this.setData({
      loadingEl: this.selectComponent(el || '#z-loading')
    })
  }
  _showLoading() {
    try {
      this.data.loadingEl.show({ fixed: true, mask: true })
    } catch (err) {
      throw new Error('Uninitialized components.')
    }
  }
  _hideLoading(delay = 300) {
    try {
      setTimeout(() => {
        if(this.data.loadingEl) {
          this.data.loadingEl.hide()
        }
      }, delay)
    } catch (err) {
      throw new Error('Uninitialized components.')
    }
  }
}

export default {
  OriginPage,
  NewPage
}
