import { getGoodsDetailById, getOrderComment } from './_service'
import um from '../../manager/userInfo'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tempUrls: [
      '../../assets/image/logo_default.png',
      '../../assets/image/logo_default.png',
      '../../assets/image/logo_default.png',
      '../../assets/image/logo_default.png',
      '../../assets/image/logo_default.png',
      '../../assets/image/logo_default.png',
    ],
    // 评价总数
    commentTotal: 0,
    productId:'',
    getAll:"",
    pageNo:1,
    commentList: [],
    likeIcon:"https://tmall.ykyao.com/oss/images/prescription/202203/d0c96e79-821c-44cb-881e-c0dc140f0065.png",
    noLikeIcon:"https://tmall.ykyao.com/oss/images/prescription/202203/1ba3c607-4f42-4ded-a38f-dc65d9f03106.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      productId: options.productId ? options.productId : '',
      getAll:options.getAll || "",
      pageNo:options.pageNo || this.data.pageNo
    })
    console.log(44,this.data.productId,options.getAll,this.data.pageNo,options.pageNo );
    this.getOrderComments()
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
  onPullDownRefresh() {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log(222);
    this.getOrderComments()
  },

  // 预览照片
  previewImage(e) {
    let { img, imgs } = e.currentTarget.dataset
    wx.previewImage({
      current: img,
      urls: imgs,
    })
  },
  //获取评价
  getOrderComments() {
    let tempCommentList = []
    um.get((user) => {
      let params = { 
        userId: this.data.getAll ? '' : user.id,
        productId: this.data.productId || '',
        pageNo:this.data.pageNo
      }
      console.log("params",params);
      getOrderComment(
        params,
        (data) => {
          this.setData({
            commentTotal: data.total,
          })
          if (data.results && data.results.length > 0) {
            data.results.forEach((item) => {
              let tempItem = {}
              // getGoodsDetailById(item.productId, (res) => {
                tempItem = {
                  ...item,
                  // productDetail: res,
                  imgList:item.imgList?JSON.parse(item.imgList):[]
                }
                tempCommentList.push(tempItem)
                console.log('tempCommentList',tempCommentList);
              // })
            })
            if(this.data.commentList.length >= 10) {
              tempCommentList = this.data.commentList.concat(tempCommentList)
            }
            this.setData({
              commentList: tempCommentList,
              pageNo:this.data.pageNo +1
            })
          }else if (this.data.pageNo > 1) {
            wx.showToast({
              icon: 'none',
              title: '暂无更多评价'
            })
          }
        }
      )
    })
  }
})
