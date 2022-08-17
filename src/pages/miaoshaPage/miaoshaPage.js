import {
  goodsListMock
} from './_config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 标签列表
    tabs: [
      {
        id: 1,
        title: "今日秒杀中"
      },
      {
        id: 2,
        title: "秒杀预告"
      }
    ],
    activeIndex: 0,
    // 商品列表
    goodsList: goodsListMock
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  // tab点击
  onTabClick(e) {
    const { index } = e.currentTarget.dataset
    console.info('onGoodsRowClick', e)
    this.setData({
      activeIndex: index
    })
  },
  onGoodsRowClick(e) {
    console.info('onGoodsRowClick', e)
  },

  onShareAppMessage() {
    let title = '秒杀活动'
    let path = `/pages/miaoshaPage/miaoshaPage`
    let params = {
      title,
      path,
      query: {}
    }
    return sm.userShare(params);
  },

  onShareTimeline() {
    let title = '秒杀活动'
    let path = `/pages/miaoshaPage/miaoshaPage`
    let params = {
      title,
      path,
      query: {}
    }
    return sm.userShare(params);
  }
})
