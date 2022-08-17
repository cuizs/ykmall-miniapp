import { tabList } from './_config'
import pay from '../../manager/payment'
import { naviBarHeight } from '../../components/mixin'
import {
  getPromoterList,
} from './_serivce'
import cnm from '../../manager/channel'
import um from '../../manager/userInfo'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import { getDate } from '../../utils/util'

Page({
  /**
   * 非页面渲染数据 Pagination
   */
  extData: {
    // 分页信息
    pagination: {
      pageNo: 1,
      pageSize: 10,
      total: 0,
    },
  },

  /**
   * 页面的初始数据
   */
  data: {
    // 订单数据
    orderData: {
    },
    pageShow: false,
    barHeight: naviBarHeight(),
    currentChannel: '',
    showMoreKey: -1,
    orderCount: 0,
    sumAmount: 0
  },
  onPageScroll() {
    this.setData({
      showMoreKey: -1
    })
  },
  /**
   * 生命周期函数
   */
  // 页面显示
  onShow() {
    wx.pageScrollTo({ scrollTop: 0, duration: 0 })
    this.getPromoterList()
    this.getUserChannel()
  },
  onReady() {
  },
  onHide() {
  },
  // 监听用户上拉触底事件
  onReachBottom() {
    const pagination = this.extData.pagination
    if (pagination.total === this.data.orderData.length) return
    this.getPromoterList()
  },

  /**
   * 页面事件
   */



  /**
   * 数据处理
   */
  getPromoterList(load = false) {
    const pagination = this.extData.pagination
    // console.log('pagination', pagination)
    if (!load) pagination.pageNo = 1
    const params = {
      ...pagination,
    }
    getPromoterList(params, !load, (data) => {
      // console.log(777, data);
      const goodsList = data.pageDto.results || []
      const orderCount = data.orderCount || 0
      const sumAmount = data.sumAmount || 0

      // 计算出商品数量的总量
      // let list = goodsList.map(itm => {
      //   let count = 0
      //   for (let i = 0; i < itm.orderLines.length; i++) {
      //     let num = itm.orderLines[i].quantity ? itm.orderLines[i].quantity : 0
      //     count = count + num
      //   }
      //   itm.goodsNum = count;
      //   return itm
      // })
      let { orderData } = this.data
      
      // 是否为下拉加载行为
      if (load) {
        orderData.push(...goodsList)
      } else {
        orderData = goodsList
      }
      console.log("orderData",orderData);
      this.setData({
        pageShow: true,
        orderData:orderData,
        orderCount: orderCount,
        sumAmount: sumAmount
      })
      pagination.total = data.total
      pagination.pageNo += 1
      
    })
  },

  getUserChannel() {
    let self = this
    um.getChannelASync().then(channel => {
      self.setData({
        currentChannel: channel
      })
    })
  },
  onPageClick(e) {
    this.setData({
      showMoreKey: -1
    })
  }
})
