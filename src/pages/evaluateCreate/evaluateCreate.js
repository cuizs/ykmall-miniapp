import Upload from '../../utils/network/upload.http'
import { getOrderDetailById, postOrderComment } from './_service'
import um from '../../manager/userInfo'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    editPage: true,
    rateValue: 5,
    description:'非常好',
    // 文件上传后的 list
    tempUrls: [],
    // 订单详情
    orderDetail: {},
    // 提交数据数组
    postData: [],
    // likeIcon:require('../../assets/icon/evaluation/heart.png'),
    // noLikeIcon:require('../../assets/icon/evaluation/no-heart.png'),
    likeIcon:"https://tmall.ykyao.com/oss/images/prescription/202203/d0c96e79-821c-44cb-881e-c0dc140f0065.png",
    noLikeIcon:"https://tmall.ykyao.com/oss/images/prescription/202203/1ba3c607-4f42-4ded-a38f-dc65d9f03106.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      getOrderDetailById(options.id, (data) => {
        this.setData({
          orderDetail: {
            ...data,
            freightAmount: data.freightAmount || 0,
          },
        })
        let tempPostData = []
        if (data.orderLines && data.orderLines.length > 0) {
          data.orderLines.forEach((item) => {
            tempPostData.push({
              id: item.id,
              merchantCode: item.merchantCode,
              orderId: data.id,
              productId: item.skuId,
              imgList: [],
              starLevel: 5,
              content: '',
            })
          })
          this.setData({
            postData: tempPostData,
          })
        }
      })
    }
  },

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

  // 评分
  onRateChange(e) {
    let { id } = e.currentTarget.dataset
    this.data.postData.forEach((item, index) => {
      if (item.id == id) {
        console.log('e.detail',e.detail);
        this.setData({
          [`postData[${index}].starLevel`]: e.detail,
        })
        this.getDescription(e.detail)
      }
    })
  },

  // 评价 textarea blur
  bindTextAreaBlur(e) {
    let { id } = e.currentTarget.dataset
    this.data.postData.forEach((item, index) => {
      if (item.id == id) {
        this.setData({
          [`postData[${index}].content`]: e.detail.value,
        })
      }
    })
  },
  //获取评价描述
  getDescription(e) {
    let description  = ''
    switch (e){
      case 1:
        description = '非常差'
      break;
      case 2:
        description = '差'
      break;
      case 3:
        description = '一般'
      break;
      case 4:
        description = '好'
      break;
      case 5:
        description = '非常好'
      break;
    }
    this.setData({
      description: description
    })
  },
  // 照片上传
  chooseImage(e) {
    let self = this
    let { id } = e.currentTarget.dataset
    self.data.postData.forEach((item, index) => {
      if (item.id == id) {
        Upload.image({
          count: 5 - item.imgList.length,
          success: (res) => {
            let list = item.imgList.concat(res)
            self.setData({
              [`postData[${index}].imgList`]: list,
            })
          },
        })
      }
    })
  },

  // 预览照片
  previewImage(e) {
    let { img, imgs } = e.currentTarget.dataset
    wx.previewImage({
      current: img,
      urls: imgs,
    })
  },

  delImage(e) {
    let { index, id } = e.currentTarget.dataset
    this.data.postData.forEach((item, k) => {
      if (item.id == id) {
        item.imgList.splice(index, 1)
        this.setData({
          [`postData[${k}].imgList`]: item.imgList,
        })
      }
    })
  },

  submit() {
    let num = 0
    this.data.postData.forEach((item) => {
      num++
      if(item.starLevel == 4 || item.starLevel == 5){
        if(!item.content){
          item.content = '商品好评!'
        }
      }
      console.log('item',item);
      postOrderComment(item, (data) => {
        if (num == this.data.postData.length) {
          wx.showToast({ title: '提交成功' })
          this.setData({
            editPage: false,
          })
        }
      })
    })
  },

  goHome() {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },

  goEvaluateDetail() {
    this.$to(`evaluateDetail/evaluateDetail`, 'navigate')
  },
})
