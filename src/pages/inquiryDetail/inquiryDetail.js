import { termsContext, expressContent } from './_config.js'
import pay from '../../manager/payment'
import { throttle } from '../../utils/util'
import {
  getOrderDetailById,
  returnOrderById,
  getOrderDeliveryById,
  fillExpressNumber,
  checkOrderLimtNum,
  getGoodsDetail,
  addDemand,
  addCart, getCartList, getDemandList,
  oneMoreOrder
} from './_service'
import cnm from '../../manager/channel'
import um from '../../manager/userInfo'

import { showLoading, hideLoading, showToast } from '../../utils/network/_handler/toast.handler'

Page({
  /**
   * 非页面渲染数据
   */
  // extData: {
  //   // 退货说明 modal
  //   returnGoodsModal: null,
  //   // 退货确认 modal
  //   returnCertainModal: null,
  //   // 退单填写 modal
  //   returnExpressNumber: null,
  //   // 退货单号（记录输入）
  //   inputExpressNumber: '',
  //   logisticsModal: null
  // },

  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    // 订单详情列表
    detail: {},
    // testExpressNumber: 'dadaddddddddddddssdadadadada hthrthw',
    // // 退货条款
    // termsContext: termsContext,
    // // 填写快递单号
    // expressContent: expressContent,
    // // 是否同意退货条款
    // isAgree: false,
    // 物流公司
    expressCompany: '',
    // 物流单号
    expressNumber: '',
    discountAmount: 0,
    // // 是医生查看还是患者
    // detailhow: true

    // 商品清单是否展开
    collapseStatus: true,
    // 退款按钮状态文案 config
    refundBtnTextConfig: {
      Created: '退货',
      ReturnApplying: '退货审核中',
      ReturnRejected: '拒绝退货',
      ReturnApproved: '申请退款',
      ApplyRefund: '退款审核中',
      Refunding: '退款中',
      Returned: '已退款',
    },
    currentChannel: ""
  },
  /**
   * 生命周期函数
   */
  onLoad (options) {
    // this.setData({
    //   detailhow: !options.hide
    // })
    if (options.id) {
      this.setData({
        orderId: options.id
      })
      this.getDetail()
      this.getCurrentChannnel()
    }
  },
  onShow () {
    if (this.data.orderId) {
      this.getDetail()
    }
  },
  getDetail () {
    let self = this;
    getOrderDetailById(this.data.orderId, (data) => {
      const express = data.express || {}
      let discountAmount = parseFloat(data.discountAmount) + (parseFloat(data.originalAmountPayable) - parseFloat(data.amountPayable))
      discountAmount = discountAmount.toFixed(2);
      data.prescription.dragUser.mobile = data.prescription.dragUser.mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
      data.prescription.dragUser.name = "*" + data.prescription.dragUser.name.slice(1)
      this.setData({
        detail: {
          ...data,
          freightAmount: data.freightAmount || 0,
        },
        discountAmount: discountAmount
      })
      console.log("detail", this.data.detail);
      let refundBtnText = ''
      if (data.orderLines && data.orderLines.length > 0) {
        console.log('data.orderLines', data.orderLines);
        data.orderLines.forEach((item, index) => {
          for (let key in self.data.refundBtnTextConfig) {
            if (key == item.status) {
              switch (key) {
                case 'Created':
                  if (
                    data.status == 'Delivered' ||
                    data.status == 'PartialRefund'
                  ) {
                    refundBtnText = self.data.refundBtnTextConfig[key]
                  }
                  break
                default:
                  refundBtnText = self.data.refundBtnTextConfig[key]
              }
              let tempItem = {
                ...item,
                refundBtnText: refundBtnText,
              }
              this.setData({
                [`detail.orderLines[${index}]`]: tempItem,
              })
            }
          }
        })
      }
    })
    getOrderDeliveryById(this.data.orderId, (data) => {
      data.expressNumber = data.expressNumber ? data.expressNumber : ''
      data.expressCompany = data.expressCompany ? data.expressCompany : ''
      this.setData({
        expressNumber: data.expressNumber.split('')
          .map((val, index) => {
            if (index !== 0 && index % 16 === 0) {
              return `${val}\n`
            } else {
              return val
            }
          })
          .join(''),
        expressCompany: data.expressCompany,
      })
    })
  },
  onReady () {
  },



  /**
   * 页面事件
   */
  //查看问诊
  onCheckClick () {
    wx.navigateTo({
      url: '/pages_hkk/inquiryChat/inquiryChat?inquiryId=' + this.data.detail.inquiryId,
    })
  },
  //获取现在渠道
  getCurrentChannnel () {
    let self = this
    um.getChannelASync().then(channel => {
      self.setData({
        currentChannel: channel
      })
    })
  }
})
