/**
 * 系统信息
 **/

const sysInfo = wx.getSystemInfoSync()

export const windowWidth = () => {
  return sysInfo.windowWidth
}

export const windowHeight = () => {
  return sysInfo.windowHeight
}

export default {
  version() {
    return sysInfo.SDKVersion
  }
}
