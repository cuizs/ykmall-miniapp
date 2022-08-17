/**
 * 筛选组件
 */
import { isIpx } from '../../utils/util'
import { naviBarHeight } from '../mixin'
import cnm from '../../manager/channel'

Component({
  externalClasses: ['z-class'],
  properties: {
    // 是否显示 home 按钮
    hasOperButton: {
      type: Boolean,
      value: true
    }
  },
  pageLifetimes: {
    show() {
      // 判断当前页面栈中是否中存在一个元素
      const pageStack = getCurrentPages()
      if (pageStack.length > 1) {
        this.setData({
          hiddenBackButton: false
        })
      }

      let info = cnm.getChannelInfos();
      // 动态计算样式
      this.setData({
        naviBackStyle: this.getNaviBackStyle(),
        naviOperStyle: this.getNaviOperStyle(),
        naviTitleStyle: this.getNaviTitleStyle(),
        title: info.name
      })
    }
  },
  data: {
    // 导航栏高度
    height: naviBarHeight(),
    // 是否显示回退按钮
    hiddenBackButton: true,
    // 导航栏返回按钮样式
    naviBackStyle: '',
    // 导航栏返回按钮大小
    naviBackSize: 24,
    // 导航栏操作按钮样式
    naviOperStyle: '',
    // 导航栏标题样式
    naviTitleStyle: '',
    // 导航栏标题
    title: '',
  },
  methods: {
    /**
     * 页面事件
     */
    // 回退事件
    onBackClick() {
      wx.navigateBack({
        delta: 1
      })
    },
    // 跳转到首页
    onOperClick() {
      wx.switchTab({
        url: '/pages/home/home'
      })
    },

    /**
     * 数据处理
     */
    // 导航栏标题样式
    getNaviTitleStyle() {
      const { height, top } = this.getMenuReact()
      return `height: ${height}px; padding-top: ${top}px;`
    },
    // 导航栏返回按钮样式
    getNaviBackStyle() {
      const { naviBackSize } = this.data
      const { height, top } = this.getMenuReact()
      return `top: ${top + (height - naviBackSize) / 2}px;`
    },
    // 导航栏操作按钮样式
    getNaviOperStyle() {
      const { naviBackSize, hiddenBackButton } = this.data
      const { height, top } = this.getMenuReact()
      if (hiddenBackButton) {
        return `top: ${top + (height - naviBackSize) / 2}px;`
      }
      return `top: ${top + (height - naviBackSize) / 2}px; left: ${10 + 10 + naviBackSize}px;`
    },
    // 获取右上角胶囊布局
    getMenuReact() {
      let menuRect = {}
      if (wx.getMenuButtonBoundingClientRect) {
        menuRect = wx.getMenuButtonBoundingClientRect()
      } else {
        if (isIpx()) {
          menuRect = { height: 32, top: 50 }
        } else {
          menuRect = { height: 32, top: 26 }
        }
      }
      return menuRect
    }
  }
})
