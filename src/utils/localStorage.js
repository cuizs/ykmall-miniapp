/**
 * 本地存储类
 */

 class Storage {
  constructor() {}

  set(key, value, expire) {
    let data = {
      value,
      expire,
      createAt: new Date().getTime()
    }
    wx.setStorageSync(key, data)
  }

  get(key) {
    const data = wx.getStorageSync(key)
    if (data) {
      if (data.expire && data.createAt + data.expire <= new Date().getTime()) {
        this.remove(key)
      } else {
        return data.value
      }
    }
    return null
  }

  clear() {
    wx.clearStorageSync()
  }

  remove(key) {
    wx.removeStorageSync(key)
  }
}

export default new Storage()
