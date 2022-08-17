import { isIpx } from '../utils/util'
import { windowHeight } from '../utils/system'

export const naviBarHeight = () => {
  const space = 6,
    ipxBarHeight = 88,
    nomalBarHeight = 64

  // 获取胶囊按钮布局 API 是否可用
  if (wx.getMenuButtonBoundingClientRect) {
    const { height, top } = wx.getMenuButtonBoundingClientRect()
    if (height && top) return height + top + space
  }

  // 当 获取胶囊按钮布局 API 或者 API返回值错误
  if (isIpx()) {
    return ipxBarHeight
  }

  return nomalBarHeight
}

export const viewportHeight = () => {
  return windowHeight() - naviBarHeight()
}
