import { tabList } from './_config'
import pay from '../../manager/payment'
import { naviBarHeight } from '../../components/mixin'
import {
  getOrderList, getGoodsDetail, getOrderDeliveryById, returnOrderById, applyRefundById, checkOrderLimtNum, addDemand,
  addCart, getCartList, getDemandList, oneMoreOrder, orderConfirm
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
    // 分页信息，订单状态作为key
    pagination: {
      ToBePaid: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      Paid: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      Finished: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      Delivered: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      All: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      AfterSale: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
    },
    logisticsModal: null,
  },

  /**
   * 页面的初始数据
   */
  data: {
    // 当前 tab 的index
    currentIdx: 0,
    // tab 列表
    tabList: tabList,
    // 订单数据
    orderData: {
      ToBePaid: [],
      Paid: [],
      Finished: [],
      Cancelled: [],
      AfterSale: [],
      Delivered: []
    },
    pageShow: false,
    // // 物流公司
    // expressNumber: '',
    // // 物流单号
    // expressCompany: '',
    // orderNumber: "",
    // 导航栏高度
    barHeight: naviBarHeight(),
    currentChannel: '',
    showMoreKey: -1
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
    const { tabList } = this.data
    const query = this.$getRouterQuery('routerQuery')
    const idx = query.tab === undefined ? 0 : query.tab

    const tabItem = tabList[idx]
    this.setData({
      currentIdx: idx,
    })
    this.getOrderListByStatus(tabItem.status)
    const modal = !!query.modal
    console.log('modal', query)
    if (modal) {
      this.hkkChannelPaySuccess()
    }

    const applyInvoice = !!query.applyInvoice
    if (applyInvoice) {
      wx.showToast({
        title: '申请成功',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result) => {

        },
        fail: () => {
        },
        complete: () => {
        }
      });

    }
    this.getUserChannel()
  },
  onReady() {
    this.extData.logisticsModal = this.selectComponent('#logistics-modal')
  },
  onHide() {
    this.$setRouterQuery({
      key: 'routerQuery',
      query: { tab: this.data.currentIdx },
    })
  },
  // 监听用户上拉触底事件
  onReachBottom() {
    const { tabList, currentIdx, orderData } = this.data
    const tabItem = tabList[currentIdx]
    const pagination = this.extData.pagination[tabItem.status]
    if (pagination.total === orderData[tabItem.status].length) return
    this.getOrderListByStatus(tabItem.status, true)
  },

  /**
   * 页面事件
   */
  // tab 点击
  onTabChange(e) {
    const { tabList } = this.data
    const { indexKey } = e.detail
    const tabItem = tabList[indexKey]
    console.log(tabItem)
    this.setData({
      currentIdx: indexKey,
      showMoreKey: -1 // 关闭所有更多下拉弹窗
    })
    this.getOrderListByStatus(tabItem.status)
  },
  // 立即选购
  onJumpGoods() {
    wx.switchTab({
      url: `/pages/category/category`
    })
    // this.$to('category/category', 'switchTab')
  },
  // 点击订单上按钮
  onOptClick(e) {
    const { id, number, type, status, detail } = e.detail
    console.log("type=====", type);
    const moreOptionsType = ['apply-invoice', 'view-invoice']
    if (this.data.showMoreKey >= 0 && !moreOptionsType.some(m => m === type)) {
      return
    }
    switch (type) {
      case 'pay':
        this.onViewPaid(id)
        break
      case 'order':
        this.onViewOrder(id)
        break
      case 'logistics':
        this.onViewLogistics(id, number)
        break
      case 'evaluate':
        this.onViewEvaluate(id)
        break
      case 'cancel':
        this.onViewCancel(id, status)
        break
      case 'buy-again':
        this.onViewBuyAgain(detail)
        break;
      case 'apply-invoice':
        this.onViewApplyInvoice(detail)
        break;
      case 'view-invoice':
        this.onViewInvoice(detail)
        break;
      case 'inquiry':
        this.onViewInquiry(detail)
        break;
      case 'confirmation':
        this.onViewconfirmation(id)
        break;

      default: {
      }
    }
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
  onViewBuyAgain(detail) {
    console.log(detail)
    oneMoreOrder(detail.id, res => {
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
    // return
    // const promiseAllList = detail.orderLines.map(val => this.checkProductStatus.call(this, val))
    // Promise.allSettled(promiseAllList)
    //   .then(res => {
    //     if (res.every(val => val.status === "fulfilled")) {
    //       // 添加进购物车
    //       const asyncBuyAgain = res.map(aba => this.handleBuyAgain.call(this, aba.value))
    //       Promise.allSettled(asyncBuyAgain).then(cb => {
    //         if (cb.every(cbv => cbv.status === "fulfilled")) {
    //           if (cb[0].value.goodsType == 2) {
    //             wx.switchTab({
    //               url: '/pages/bill/bill'
    //             })
    //           } else {
    //             wx.switchTab({
    //               url: '/pages/cart/cart'
    //             })
    //           }
    //         }
    //       })
    //     } else {
    //       // 联系客服
    //       wx.showModal({
    //         title: '温馨提示',
    //         content: '部分/全部商品已售罄，可联系药师预约',
    //         showCancel: true,
    //         success: (res) => {
    //           if (res.confirm) {
    //             cnm.openChannelCustomerService()
    //           }
    //         },
    //       })
    //     }
    //   })
  },
  // 查看订单
  onViewOrder(id) {
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${id}`
    })
  },
  // 取消订单
  onViewCancel(id, status) {
    let self = this
    let tipsTitle = status === 'Paid' ? '确认取消订单并发起退款申请吗？' : '确认取消订单'
    wx.showModal({
      title: '提示',
      content: tipsTitle,
      success(res) {
        if (res.confirm) {
          if (status === 'ToBePaid') {
            self.cancelOrder(id)
          } else if (status === 'Paid') {
            self.applyRefundById(id)
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },
  // 未付款时取消订单
  cancelOrder(id) {
    let parms = {
      event: 'Cancel',
    }
    let self = this
    returnOrderById(id, parms, (res) => {
      self.cancelSuccess('取消成功')
    })
  },

  // 已付款未发货时，申请退款申请
  applyRefundById(id) {
    let parms = {
      id: id,
    }
    let self = this
    applyRefundById(id, parms, (res) => {
      if (res.status == 'Delivered') {
        self.cancelSuccess('订单已发货');
      } else {
        self.cancelSuccess('申请成功')
      }
    })
  },

  cancelSuccess(tips = '取消成功') {
    this.getOrderListByStatus(
      this.data.tabList[this.data.currentIdx].status
    )
    wx.showToast({
      title: tips,
      icon: 'none',
      duration: 2000,
    })
  },

  // 立即付款
  onViewPaid(id) {
    checkOrderLimtNum(id, {}, () => {
      pay({
        orderId: id,
        success: () => {
          // 跳转到订单列表 待发货
          const tabItem = tabList[1]
          this.getOrderListByStatus(tabItem.status)
          this.setData({
            currentIdx: 1,
          })
          let channel = um.getCurrentChannel()
          if (channel === 'hkk') {
            this.hkkChannelPaySuccess()
          }
        },
      })
    })
  },
  // 查看物流
  onViewLogistics(id, number) {
    getOrderDeliveryById(id, (data) => {
      this.onLogisticsClick(data)
    })
  },
  // 查看物流
  onLogisticsClick(data) {
    wx.navigateTo({
      url: `/pages/logisticsDetail/logisticsDetail?orderNumber=${data.orderNumber}&expressCompany=${data.expressCompany}&expressNumber=${data.expressNumber}`,
    })
  },
  // 去评价
  onViewEvaluate(id) {
    wx.navigateTo({
      url: `/pages/evaluateCreate/evaluateCreate?id=${id}`,
    })
    // this.$to(`evaluateCreate/evaluateCreate?id=${id}`, 'navigate')
  },
  onViewApplyInvoice(detail) {
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
    this.setData({
      showMoreKey: -1
    })
    wx.navigateTo({
      url: `/pages/applyInvoice/applyInvoice?id=${detail.id}&amount=${detail.totalAmount}`
    })
  },
  onViewInvoice(detail) {
    console.log('detail', detail)
    if (detail.invoice && detail.invoice.status && detail.invoice.status === 2 && detail.invoice.picUrl) {
      console.log(detail.invoice.picUrl.match(/pdf/))
      console.log(detail.invoice.picUrl)

      if (detail.invoice.picUrl.match(/pdf/)) {
        console.log('进来了')
        wx.downloadFile({
          url: detail.invoice.picUrl.replace(/^\s+|\s+$/g, ""),
          success(res) {
            console.log(res)
            wx.openDocument({
              showMenu: true,
              filePath: res.tempFilePath,
            })
          },
          fail(err) {
            console.log(err)
          }
        })
      } else {
        wx.navigateTo({
          url: `/pages/viewInvoice/viewInvoice?picUrl=${detail.invoice.picUrl}`
        })
        // this.$to(`viewInvoice/viewInvoice?picUrl=${detail.invoice.picUrl}`, 'navigate')
      }
    }
  },
  onViewInquiry(detail) {
    if (detail.inquiryStatus != -1 || detail.inquiryStatus == 0) {
      wx.navigateTo({
        url: `/pages/inquiryDetail/inquiryDetail?id=${detail.id}`
      })
      // this.$to(`inquiryDetail/inquiryDetail?id=${detail.id}`, 'navigate')
    }
  },
  // 确认收货
  onViewconfirmation(orderId) {
    // wx.show
    Dialog.confirm({
      title: '确认收货',
      message: '为了保证您的售后权益，请收到商品确认无误后再确认收货'
    })
      .then(() => {
        // on confirm
        console.log('确认')
        console.log(orderConfirm)
        orderConfirm(orderId, (res) => {
          console.log('res', this.data.tabList[this.data.currentIdx].status)
          this.getOrderListByStatus(
            this.data.tabList[this.data.currentIdx].status
          )
        }, () => {
        })
      })
      .catch(() => {
        // on cancel
      })
  },
  /**
   * 数据处理
   */
  getOrderListByStatus(status, load = false) {
    const pagination = this.extData.pagination[status]
    console.log('pagination', pagination)
    if (!load) pagination.pageNo = 1
    let orderStatus = ""
    // console.log("status",status);
    if (status == "Delivered") {
      let list = ["Delivered", "Completed"]
      orderStatus = list.join(",")
    } 
    else if (status == "AfterSale") {
      let list = ["ReturnApproving", "ReturnApproved", "ReturnApplySuccess", "Refunded", "Refunding", "ReturnApproved", "PartialRefund"]
      orderStatus = list.join(",")
    }
    else {
      orderStatus = status
    }
    const params = {
      ...pagination,
      // orderStatus: status == 'All' ? '' : status,
      statuses: orderStatus == 'All' ? '' : orderStatus,
    }
    getOrderList(params, !load, (data) => {
      const goodsList = data.results || []
      // 计算出商品数量的总量
      let list = goodsList.map(itm => {
        let count = 0
        for (let i = 0; i < itm.orderLines.length; i++) {
          let num = itm.orderLines[i].quantity ? itm.orderLines[i].quantity : 0
          count = count + num
        }
        itm.goodsNum = count;
        return itm
      })
      const { orderData } = this.data
      this.setData({ pageShow: true })
      // 是否为下拉加载行为
      if (load) {
        orderData[status].push(...list)
      } else {
        orderData[status] = list
      }

      pagination.total = data.total
      pagination.pageNo += 1
      this.setData({
        [`orderData.${status}`]: orderData[status],
      }, () => {
        console.log('orderData', this.data.orderData)
      })
    })
  },
  hkkChannelPaySuccess() {
    wx.showModal({
      title: '温馨提示',
      content: '您已成功下单，订单会由平台审核后尽快发货，17点前的订单当天17点后统一发货，17点后的订单次日17点后统一发货',
      success: () => {
        this.$setRouterQuery({
          key: 'routerQuery',
          query: { tab: this.data.currentIdx },
        })
      }
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
  onMoreClick(e) {
    console.log('order', e.detail.key)
    this.setData({
      showMoreKey: e.detail.key
    }, () => {
      console.log('showMoreKey', this.data.showMoreKey)
    })
  },
  onPageClick(e) {
    // e.stopPropagation()
    // console.log(e)

    this.setData({
      showMoreKey: -1
    })
  }
})
