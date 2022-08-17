Page({
  /**
   * 页面的初始数据
   */
  data: {
    src: ''
  },

  /**
   * 生命周期函数
   */
  onLoad(options) {
    this.loadingHandler()
    this.setData({ src: options.url })
  },

  /**
   * 页面事件
   */
  onImageLoad(e) {
    this.loadingHandler('hide')
  },

  loadingHandler(type = 'show') {
    const delay = type === 'show' ? 0 : 500
    setTimeout(() => {
      type === 'show' ? wx.showLoading() : wx.hideLoading()
    }, delay)
  }
})
