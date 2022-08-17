

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl:
      'https://ykyao-mall.oss-cn-shanghai.aliyuncs.com/dev/2SymFT1655370764412.jpg',
  },
  onLoad(options) {
    if(options.currentChannel == 'hkk') {
     this.setData({
      imageUrl:"https://mall.ykyao.com/oss/images/CMS/202206/a9820d41-abf1-44af-bc8e-4ba3f6ef9dc1.png"
     })
    }
  }
})
