//获取应用实例
var app = getApp()

import { region } from './_config'
import pay from '../../manager/payment'
import local from '../../utils/localStorage'
import { createOrder, prescriptionDetail, orderByRecipeNumber } from './_serve'

const INTERVAL = 1 * 24 * 60 * 60

Page({
  extends: {
    recipeNumber: null
  },

  /**
   * 页面的初始数据
   */
  data: {
    format: ['天  ', ':', ':', ':'],
    detail: {},
    address: null,
    freightAmount: 0,
    orderDetail: null,
    interval: 0,
    // 商品总计
    moneyTotal: 0,
    // 0 => 生效中 1 => 已经支付查看订单 2 => 失效订单
    step: null
  },

  /**
   * 生命周期
   */
  onLoad(options) {
    wx.hideHomeButton()

    const recipeNumber = app.globalData.queryOption.recipeNumber || options.recipeNumber
    this.extends.recipeNumber = recipeNumber || ''
    prescriptionDetail({ recipeNumber: recipeNumber }, data => {
      const { createTime, sku } = data.presData
      this.setData({
        detail: data.presData
      })
      let total = 0
      if (sku) {
        sku.forEach(item => {
          let price = item.memberPrice || item.actualPrice
          total = total + price * item.quantity
        })
        this.setData({
          moneyTotal: total
        })
      }
      this.getReciprocalTime(createTime * 1)
    })
  },
  onShow() {
    orderByRecipeNumber(this.extends.recipeNumber, data => {
      const address = local.get('ADDRESS')
      this.setData({
        orderDetail: data || null,
        address: data.orderAddress || address || null,
        freightAmount: data.freightAmount || 0
      })
      if (!data.status) return
      if (data.status === 'ToBePaid' || data.status == 'Created') {
        this.setData({
          step: 0
        })
      } else {
        this.setData({
          step: 1
        })
      }
    })
  },

  /**
   * 页面事件
   */
  // 商品 cell 点击
  onCellClick(e) {
    const { id } = e.currentTarget.dataset
    this.$to(`goodsDetail/goodsDetail?id=${id}`, 'navigate')
  },
  // 邮费提示
  onClickpropt() {
    wx.showModal({
      title: '运费明细',
      content:
        '江苏省、浙江省、山东省、安徽省、福建省、江西省和上海市免运费，其余城市收取 12 元运费',
      showCancel: false,
      confirmText: '我知道了'
    })
  },
  // 获取地址
  onClickAddress() {
    this.$to(
      `checkout/checkout?from=advanceOrder/advanceOrder&recipeNumber=${this.extends.recipeNumber}`
    )
  },
  // 查看订单详情
  onViewClick() {
    this.$to(`orderDetail/orderDetail?id=${this.data.orderDetail.id}`, 'navigate')
  },
  // 预览图片
  onImageClick(e) {
    const { img } = e.currentTarget.dataset
    wx.previewImage({
      current: img,
      urls: [img]
    })
  },
  // 确定结算
  onSubmitClick() {
    const { detail, freightAmount, orderDetail, address } = this.data
    if (!address) {
      wx.showToast({
        icon: 'none',
        title: '请选择收件人地址'
      })
      return
    }
    if (orderDetail.id) {
      this.payMoney(orderDetail.id)
      return
    }
    const params = {
      orderAddress: address,
      orderLines: detail.sku,
      recipeNumber: this.extends.recipeNumber,
      freightAmount: freightAmount,
      tpCustomerIdentity: detail.member.memberId
    }
    createOrder(params, id => {
      local.removeItem('ADDRESS')
      this.payMoney(id)
    })
  },
  // 倒计时结束
  endTime() {
    this.setData({
      step: 2
    })
  },
  /**
   * 获取倒数时间
   */
  getReciprocalTime(createTime = 0) {
    const now = new Date().valueOf()
    const diff = parseInt((now - createTime) / 1000)
    const params = { step: diff < INTERVAL ? 0 : 2 }
    diff < INTERVAL && (params['interval'] = INTERVAL - diff)

    this.setData({ ...params })
  },

  // 支付
  payMoney(id) {
    pay({
      orderId: id,
      success: () => {
        // 跳转到订单列表 待发货
        this.$setRouterQuery({
          key: 'routerQuery',
          query: { tab: 2 }
        })
        this.$to('order/order')
      },
      fail: () => {
        //  跳转到订单列表 待支付
        this.$setRouterQuery({
          key: 'routerQuery',
          query: { tab: 1 }
        })
        this.$to('order/order')
      }
    })
  }
})
