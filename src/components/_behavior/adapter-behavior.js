/**
 * 关于适配behavior
 */
import { isIpx } from '../../utils/util'

export const naviBarHeight = () => {
  const space = 6,
    ipxBarHeight = 88,
    nomalBarHeight = 64

  // 获取胶囊按钮布局 API 是否可用
  if (wx.getMenuButtonBoundingClientRect) {
    const { height, top } = wx.getMenuButtonBoundingClientRect()
    if (height && top) return height + top + space
  }

  // 当 获取胶囊按钮布局 API 不可用 || API返回出现bug
  if (isIpx()) {
    return ipxBarHeight
  }

  return nomalBarHeight
}

export default Behavior({
  // 页面渲染数据
  data: {
    // 是否为iPhoneX~
    bh_isIpx: isIpx(),
    // iPhoneX~底部距离
    bh_IpxPt: 34,
    // 自定义导航栏的高度
    bh_naviBarHeight: naviBarHeight()
  },

  // 页面方法
  methods: {}
})
