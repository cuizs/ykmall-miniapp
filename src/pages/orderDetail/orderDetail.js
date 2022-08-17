import { stepsList } from './_config.js'
import pay from '../../manager/payment'
import freightPayment from '../../manager/freightPayment'
import { debounce, throttle } from '../../utils/util'
import {
  getOrderDetailById,
  returnOrderById,
  getOrderDeliveryById,
  fillExpressNumber,
  checkOrderLimtNum,
  getGoodsDetail,
  addDemand,
  addCart, getCartList, getDemandList,
  oneMoreOrder,
  orderConfirm
} from './_service'
import cnm from '../../manager/channel'
import um from '../../manager/userInfo'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'

Page({
  /**
   * 非页面渲染数据
   */
  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    // 订单详情列表
    detail: {},
    // 物流公司
    expressCompany: '',
    // 物流单号
    expressNumber: '',
    discountAmount: 0,
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
    currentChannel: '',
    //全部问诊状态List
    steps: stepsList,
    //问诊状态栏
    stepList: [],
    currentStep: 0

  },
  /**
   * 生命周期函数
   */
  onLoad(options) {
    if (options.id) {
      this.setData({
        orderId: options.id
      })
      this.getDetail()
    }
    let self = this
    um.getChannelASync().then(channel => {
      self.setData({
        currentChannel: channel
      })
    })
  },
  onShow() {
    if (this.data.orderId) {
      this.getDetail()
    }
  },
  getDetail() {
    let self = this;
    getOrderDetailById(this.data.orderId, (data) => {
      const express = data.express || {}
      let discountAmount = parseFloat(data.discountAmount) + (parseFloat(data.originalAmountPayable) - parseFloat(data.amountPayable))
      discountAmount = discountAmount.toFixed(2);
      this.setData({
        detail: {
          ...data,
          freightAmount: data.freightAmount || 0,
        },
        discountAmount: discountAmount
      })
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
      self.getStatusList()
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
  //获取问诊订单状态栏
  getStatusList() {
    let self = this
    let stepList = []
    let currentStep = []
    let step = this.data.steps
    //预约支付
    if (this.data.detail.status == "ToBePaid") {
      stepList = [step[0], step[1], step[3], step[5], step[7]]
      currentStep = 1
      self.setData({
        stepList: stepList,
        currentStep: currentStep
      })
      return
    }
    if (this.data.detail.status == "Cancelled") {
      //取消订单
      stepList = [step[0], step[2], step[3], step[5], step[7]]
      currentStep = 1
      self.setData({
        stepList: stepList,
        currentStep: currentStep
      })
      return
    }
    //订单发货
    if (this.data.expressCompany) {
      stepList = [step[0], step[1], step[3], step[5], step[7]]
      currentStep = 4
      self.setData({
        stepList: stepList,
        currentStep: currentStep
      })
      return
    }

    //开方失败-医生拒绝未开方（医生未开方且手动结束问诊 or 医生未开方且问诊超时自动结束）自动退款
    if (this.data.detail.inquiryStatus == "2" && this.data.detail.prescriptionStatus == 0 && this.data.detail.autoRefund) {
      //不是患者自动取消订单 或者 患者自动取消订单但是订单为退款中
      if (!this.data.detail.returnNumber || (this.data.detail.returnNumber && this.data.detail.status == "Refunding")) {
        stepList = [step[0], step[1], step[4], step[5], step[7]]
        currentStep = 2
        self.setData({
          stepList: stepList,
          currentStep: currentStep
        })
        return
      }

    }

    if (this.data.detail.prescriptionStatus == 7) {
      //不是患者自动取消订单 或者 患者自动取消订单但是订单为退款中
      if (!this.data.detail.returnNumber || (this.data.detail.returnNumber && this.data.detail.status == "Refunding")) {
        //审方驳回-处方审核拒绝
        stepList = [step[0], step[1], step[3], step[6], step[7]]
        currentStep = 3
        self.setData({
          stepList: stepList,
          currentStep: currentStep
        })
        return
      }
    }

    if (this.data.detail.inquiryStatus == 1 && this.data.detail.prescriptionStatus == 0 && this.data.detail.status != "Refunded") {
      //医生开方-医生未开方且问诊未结束
      stepList = [step[0], step[1], step[3], step[5], step[7]]
      currentStep = 2
      self.setData({
        stepList: stepList,
        currentStep: currentStep
      })
      return
    }

    if (this.data.detail.status == "Refunded") {
      //已退款
      stepList = [step[0], step[1], step[8],]
      currentStep = 2
      self.setData({
        stepList: stepList,
        currentStep: currentStep
      })
      return
    }
    switch (this.data.detail.prescriptionStatus) {
      case 0:
        //预约支付-未开具
        stepList = [step[0], step[1], step[3], step[5], step[7]]
        currentStep = 1
        break
      case 5:
        //药师审方-开具用药建议-医生已开方/医生建议（处方等待互医同步审方状态，医生建议对接一体化倒配处方
        stepList = [step[0], step[1], step[3], step[5], step[7]]
        currentStep = 3
        break
      case 6:
        //药师审方-处方审核通过-医生已开方/医生建议（处方等待互医同步审方状态，医生建议对接一体化倒配处方
        stepList = [step[0], step[1], step[3], step[5], step[7]]
        currentStep = 3
        break
      case 8:
        //药师审方-开具处方-医生已开方/医生建议（处方等待互医同步审方状态，医生建议对接一体化倒配处方
        stepList = [step[0], step[1], step[3], step[5], step[7]]
        currentStep = 3
        break
    }
    self.setData({
      stepList: stepList,
      currentStep: currentStep
    })
    console.log("stepList", self.data.stepList);
    console.log("currentStep", self.data.currentStep);
  },
  onReady() {
  },
  ongoodsClick(event) {
    const goodsDetail = event.currentTarget.dataset.detail
    this.$to(`goodsDetail/goodsDetail?id=${goodsDetail.productId}`, 'navigate')
  },
  //查看问诊
  onCheckClick() {
    wx.navigateTo({
      url: '/pages_hkk/inquiryChat/inquiryChat?inquiryId=' + this.data.detail.inquiryId,
    })
  },
  // 商品清单收起展开
  onCollapseClick() {
    this.setData({
      collapseStatus: !this.data.collapseStatus,
    })
  },

  /**
   * 页面事件
   */
  // 立即支付
  onPayClick() {
    const { detail } = this.data
    // showToast('商品最大购买数量超过限制，请取消订单重新下单')
    // return
    throttle(() => {
      checkOrderLimtNum(detail.id, {}, () => {
        pay({
          orderId: detail.id,
          success: () => {
            // 跳转到订单列表 待发货
            const channel = um.getCurrentChannel()
            console.log('channel', channel)
            if (channel === 'hkk') {
              this.$setRouterQuery({
                key: 'routerQuery',
                query: { tab: 1, modal: true },
              })
            } else {
              this.$setRouterQuery({
                key: 'routerQuery',
                query: { tab: 1 },
              })
            }

            this.$to('order/order')
          },
        })
      })
    })

  },
  // 运费支付
  onFreightPayClick() {
    const { detail } = this.data
    throttle(() => {
      freightPayment({
        orderFreightId: detail.freight.id,
        success: () => {
          if (this.data.orderId) {
            this.getDetail()
          }
        },
      })
    })

  },
  onCancelClick() {
    const { detail } = this.data
    let self = this
    wx.showModal({
      title: '提示',
      content: '确认取消订单？',
      success(res) {
        if (res.confirm) {
          let parms = {
            event: 'Cancel',
            id: detail.id,
          }
          returnOrderById(parms, (res) => {
            self.$setRouterQuery({
              key: 'routerQuery',
              query: { tab: 0 },
            })
            self.$to('order/order')
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },
  // 退货
  onRefundClick(e) {
    if (!this.data.expressCompany && !this.data.expressNumber && this.data.detail.status == 'Refunded') { // 未发货已退款
      const { id } = e.currentTarget.dataset
      this.$to(`refund/refund?id=${this.data.detail.id}&goodId=${id}`, 'navigate')
    } else {
      const { id } = e.currentTarget.dataset
      this.$to(`refund/refund?id=${this.data.detail.id}&goodId=${id}`, 'navigate')
    }
  },

  // 查看物流
  onLogisticsClick() {
    this.$to(
      `logisticsDetail/logisticsDetail?orderNumber=${this.data.detail.orderNumber}&expressCompany=${this.data.expressCompany}&expressNumber=${this.data.expressNumber}`,
      'navigate'
    )
  },

  checkProductStatus(goods) {
    return new Promise((resolve, reject) => {
      getGoodsDetail(goods.productId, (res) => {
        const goodsDetail = res.data
        const currentSku = (goodsDetail.sku || []).find(val => val.id === goods.skuId)
        const params = { ...currentSku }
        params.goodsId = goodsDetail.id
        params.isGroup = 0
        params.skuName = currentSku.name
        params.skuId = currentSku.id
        params.spuId = goodsDetail.id;
        params.distributorProductName = goodsDetail.distributorProductName || '';
        params.distributorImgUrl = goodsDetail.distributorImgUrl || goodsDetail.imgUrl || '../../assets/image/defaultImg.png';
        params.quantity = 1
        // 设置推荐人
        if (goods.referrer) params.referrer = goods.referrer
        if (goods.referrerDoctorId) params.referrerDoctorId = goods.referrerDoctorId
        // 设置推广人
        if (goods.partnerReferrerId) params.partnerReferrerId = goods.partnerReferrerId
        if (goodsDetail.actualPrice == 0 || !goodsDetail.actualPrice || goodsDetail.status !== 'Enable') {
          reject(goods)
        } else {
          resolve(params)
        }
      }, (error) => {
        if (error.code === 1007) {
          reject(goods)
        }
      })
    })
  },
  handleBuyAgain(sku) {
    console.log(sku)
    return new Promise((resolve, reject) => {
      if (sku.goodsType == 2) { // 加入需求清单
        getDemandList(cartList => {
          console.log('getDemandList', cartList)
          if (cartList.some(cl => cl.spuId === sku.spuId)) {
            resolve(sku)
          } else {
            // 购物车里不存在
            addDemand(sku, (res) => {
              resolve(sku)
            })
          }
        })

      } else { // 加入购物车
        getCartList(cartList => {
          console.log('getCartList', cartList)
          if (cartList.some(cl => cl.spuId === sku.spuId)) {
            resolve(sku)
          } else {
            // 购物车里不存在
            addCart(sku, (res) => {
              resolve(sku)
            })
          }
        })
      }
    })
  },
  // 再次购买
  onViewBuyAgain: debounce(function () {
    const detail = this.data.detail
    oneMoreOrder(detail.id, res => {
      console.log('dadadada', res)
      const goodsType = res
      if (goodsType === 2) {
        wx.switchTab({
          url: '/pages/bill/bill'
        })
      } else {
        wx.switchTab({
          url: '/pages/cart/cart'
        })
      }
    }, err => {
      if (err.code === 1007) {
        // 联系客服
        wx.showModal({
          title: '温馨提示',
          content: '部分/全部商品已售罄，可联系药师预约',
          showCancel: true,
          success: (res) => {
            if (res.confirm) {
              cnm.openChannelCustomerService()
            }
          },
        })
      }
    })
  }, 300),
  onApplyInvoiceClick(e) {
    console.log(e)
    const detail = e.currentTarget.dataset.detail
    if (detail.invoice && detail.invoice.status && detail.invoice.status === 1) {
      Dialog.alert({
        message: '发票申请中，如有问题请联系客服'
      })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
        })
      return
    }
    this.$to(`applyInvoice/applyInvoice?id=${detail.id}&amount=${detail.totalAmount}`, 'navigate')

  },
  onViewInvoiceClick(e) {
    const detail = e.currentTarget.dataset.detail
    if (detail.invoice && detail.invoice.status && detail.invoice.status === 2 && detail.invoice.picUrl) {
      if (detail.invoice.picUrl.match(/pdf/)) {
        // if (false) {

        let fileName = new Date().valueOf();

        wx.downloadFile({
          url: detail.invoice.picUrl.replace(/^\s+|\s+$/g, ""),
          success(res) {
            console.log(res)
            wx.openDocument({
              showMenu: true,
              filePath: res.tempFilePath,
            })
          }
        })
      } else {

        this.$to(`viewInvoice/viewInvoice?picUrl=${detail.invoice.picUrl}`, 'navigate')

      }
    }
  },
  onConfirmationClick(e) {
    // console.log('e', e)
    // wx.show
    Dialog.confirm({
      title: '确认收货',
      message: '为了保证您的售后权益，请收到商品确认无误后再确认收货'
    })
      .then(() => {
        // on confirm
        console.log('确认')
        console.log(orderConfirm)
        orderConfirm(this.data.orderId, (res) => {
          this.getDetail()
          // console.log('res', this.data.tabList[this.data.currentIdx].status)
          // this.getOrderListByStatus(
          //     this.data.tabList[this.data.currentIdx].status
          // )
        }, () => {
        })
      })
      .catch(() => {
        // on cancel
      })
  }
})
