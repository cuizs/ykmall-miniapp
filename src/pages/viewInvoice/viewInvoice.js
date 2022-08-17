
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl: ''
  },


  /**
   * 生命周期函数
   */
  onLoad (options) {
    console.log('options', options)
    const { picUrl = '' } = options
    const that = this
    if (picUrl.match(/pdf/)) {
      // if (false) {

      let fileName = new Date().valueOf();

      wx.downloadFile({
        url: picUrl,
        success (res) {
          console.log(res)
          // that.setData({
          //   picUrl: res.filePath
          // })
          wx.openDocument({
            showMenu: true,
            filePath: res.tempFilePath,
          })
        }
      })
    } else {
      that.setData({
        picUrl
      })
    }
  },
  showPic () {
    wx.previewImage({ urls: [this.data.picUrl] })
  },
  saveImg () {
    let that = this;
    //文件名设置为时间戳
    let fileName = new Date().valueOf();
    wx.downloadFile({ //下载图片到本地
      url: that.data.picUrl,
      filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.png',
      success (res) {
        console.log(res)
        if (res.statusCode === 200) {
          let img = res.filePath
          wx.saveImageToPhotosAlbum({ //只支持本地图片所以要先把图片下载下来
            filePath: img,
            success (result) {
              console.log(result)
              wx.showToast({
                title: '已保存至相册',
                icon: "none",
              })
            },
            fail (res) {
              console.log(result)
              wx.showToast({
                title: '保存失败',
                icon: "none",
              })
            }
          })
        }
      }
    })
  }
})
