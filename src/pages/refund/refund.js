import {
  getOrderDetailById,
  refundOrder,
  getRefundOrderInfo,
  putRefundOrderlogisticsInfo,
  getOrderRefundListById
} from './_service'
import { mul, numSub, add } from '../../utils/util'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    // 物流单号
    logisticsNumber: '',
    // 物流公司
    logisticsCompany: '',
    showPopup: false,
    companyColumns: [
      '顺丰快递',
      '申通快递',
      '圆通快递',
      '中通快递',
      '百世汇通',
      '韵达快递',
    ],
    // 订单详情
    orderDetail: {},
    // 商品详情
    goodDetail: {},
    // 退款金额
    refundPrice: 0,
    supportedValue: 0, // 商品已保价金额
    // 退款数量
    refundQuantity: 1,
    // 最大退款数量
    maxRefundQuantity: 1,

    // 提交过的退款金额
    applyRefundAmount: 0,
    // 提交过的退款数量
    applyRefundNum: 0,
    // 物流公司
    returnExpressCompany: '',
    // 物流单号
    returnExpressNumber: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    console.info('options', options)
    this.setData({
      options: options,
    })
    this.getInfo(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () { },

  // 获取页面所需信息
  getInfo (options) {
    if (options.id && options.goodId) {
      getOrderDetailById(options.id, (data) => {
        const express = data.express || {}
        this.setData({
          orderDetail: {
            ...data,
            freightAmount: data.freightAmount || 0,
          },
        })
        getOrderRefundListById(data.orderNumber, refundData => {
          let supportValueList = refundData && refundData.supportValueList ? refundData.supportValueList : []
          if (data && data.orderLines) {
            data.orderLines.forEach((item) => {
              let supportedValue = 0
              for (let i = 0; i < supportValueList.length; i++) {
                let products = supportValueList[i].products ? supportValueList[i].products : []
                products.forEach(itm => {
                  if (itm.productCode == item.serialNumber) {
                    // 得出该商品的总计已保价金额
                    supportedValue = itm.productPrice
                  }
                })
              }
              console.log('supportedValue', supportedValue)
              if (item.id == options.goodId) {
                let refundPrice = item.isMemberPrice
                ? numSub(
                  mul(item.memberPrice * 100, item.quantity),
                  add(mul(item.discountAmount * 100, item.quantity), supportedValue * 100)
                ) / 100
                : numSub(
                  mul(item.actualPrice * 100, item.quantity),
                  add(mul(item.discountAmount * 100, item.quantity), supportedValue * 100)
                ) / 100
                refundPrice = refundPrice.toFixed(2);
                this.setData({
                  supportedValue: supportedValue,
                  goodDetail: item,
                  refundQuantity: item.quantity,
                  maxRefundQuantity: item.quantity,
                  refundPrice: refundPrice,
                })
                if (item.returnNumber) {
                  this.getRefundInfo(item.returnNumber)
                }
              }
            })
          }
        })
      })
    }
  },

  showCompanyPopup () {
    console.info('showCompanyPopup')
    this.setData({
      showPopup: true,
    })
  },

  hideCompanyPopup () {
    console.info('hideCompanyPopup')
    this.setData({
      showPopup: false,
    })
  },

  onConfirm (e) {
    const { value } = e.detail
    this.setData({
      logisticsCompany: value,
      showPopup: false,
    })
  },

  getRefundInfo (number) {
    let self = this
    getRefundOrderInfo(number, (res) => {
      let num = 0
      res.returnSku.forEach((item) => {
        if (item.productCode == self.data.goodDetail.serialNumber) {
          num = item.qty
          self.setData({
            applyRefundAmount: res.applyRefundAmount,
            applyRefundNum: num,
            returnExpressCompany: res.returnExpressCompany,
            returnExpressNumber: res.returnExpressNumber,
          })
        }
      })
    })
  },

  // 提交退货
  submitRefund () {
    console.info('submitRefund-xxx')
    let self = this
    let pamras = {
      applyRefundAmount: self.data.refundPrice,
      orderId: self.data.orderDetail.id,
      orderLineId: self.data.goodDetail.id,
      qty: self.data.refundQuantity,
    }

    refundOrder(self.data.orderDetail.id, pamras, (res) => {
      console.info('refundOrder-xxx', res)
      self.getInfo(self.data.options)
    })
  },

  // 退款数量变化
  onQuantityChange (e) {
    let totalSupportedValue = (this.data.supportedValue / this.data.goodDetail.quantity) * e.detail
    totalSupportedValue = totalSupportedValue.toFixed(2);

    let refundPrice = this.data.goodDetail.isMemberPrice
    ? numSub(
      mul(this.data.goodDetail.memberPrice * 100, e.detail),
      add(mul(this.data.goodDetail.discountAmount * 100, e.detail), totalSupportedValue * 100)
    ) / 100
    : numSub(
      mul(this.data.goodDetail.actualPrice * 100, e.detail),
      add(mul(this.data.goodDetail.discountAmount * 100, e.detail), totalSupportedValue * 100)
    ) / 100
    refundPrice = refundPrice.toFixed(2)
    this.setData({
      refundQuantity: e.detail,
      refundPrice: refundPrice,
    })
  },

  // 提交物流信息
  submitLogistics () {
    console.info('submitLogistics-xxx')
    let self = this
    if (!self.data.logisticsCompany) {
      wx.showToast({
        title: '请选择物流公司',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    if (!self.data.logisticsNumber) {
      wx.showToast({
        title: '请填写物流单号',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    wx.showLoading({
      title: '提交中...',
    })
    let pamras = {
      returnExpressCompany: self.data.logisticsCompany,
      returnExpressNumber: self.data.logisticsNumber,
    }
    putRefundOrderlogisticsInfo(
      self.data.goodDetail.returnNumber,
      pamras,
      (res) => {
        console.info('putRefundOrderlogisticsInfo-xxx', res)
        self.getInfo(self.data.options)
        wx.hideLoading()
      },
      (err) => {
        wx.hideLoading()
      }
    )
  },
})
