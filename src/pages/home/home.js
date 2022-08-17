import { categoryListMock } from './_config'
import um from '../../manager/userInfo'
import dm from '../../manager/demand'
import cm from '../../manager/cart'
import cnm from '../../manager/channel'
import { EXIST_CHANNEL_LIST } from '../../config/basisConfig'
import sm from '../../manager/share'
import { navigateByInfo } from '../../manager/navigate'
import { getCmsByType, getIsCampaignHomePage } from './_service'
import { handleCouponUtilFun } from '../../mixins/coupon'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 系列列表
    seriesList: [],
    // 待领取优惠券
    couponList: [],
    // 轮播列表
    bannerList: [],
    // 分类列表
    categoryList: [],
    categoryListDefault: categoryListMock,
    //新人专享
    campaignObj: {},
    // 代理商页面按钮
    agentBtnVisible: false,
    userInfo: {},
    // 新人专享
    exclusiveForNewPeople: [],
    currentChannel: '',
    channelList: EXIST_CHANNEL_LIST,
    iscustomHomePage: false,
    ratioTo375: 1,
    layout: [],
  },
  /**
   * 生命周期函数
   */
  onLoad () {
    getIsCampaignHomePage(res => {
      console.log('res', res)
      if (res) {
        this.setData({
          iscustomHomePage: true,
          layout: JSON.parse(res.layout)
        }, () => {
          console.log('layout', this.data.layout)
          wx.nextTick(() => {
            console.log(wx.createSelectorQuery().in(this).select('.layout'))
            wx.createSelectorQuery().in(this).selectAll('#layout').boundingClientRect().exec((res) => {
              console.log('layout', res[0][0])
              if (res && res.length > 0) {
                const ratioTo375 = res[0][0].width / 375
                console.log(ratioTo375)
                this.setData({
                  ratioTo375
                })
              }

            })

          });
        })
      } else {
        this.$initLoading();
        this.$showLoading();
        this.initLoad(false);
      }
    })
  },
  onShow () {
    um.refresh((userInfo) => {
      this.setData({
        userInfo,
        agentBtnVisible: um.identityViewer().isAgent,
      })
    })
    this.setChannelTheme()
    const isRefresh = this.$getRouterQuery('isRefresh')
    if (isRefresh) {
      this.initLoad(false)
    }
    dm.fetchDemandCount()
    cm.fetchCartCount()
  },
  onReady () {

  },
  onPullDownRefresh () {
    this.initLoad(false)
  },

  setChannelTheme () {
    let self = this
    um.getChannelASync().then(channel => {
      console.log("channel====", channel);
      self.setData({
        currentChannel: channel,
      })
      wx.setNavigationBarTitle({
        title: cnm.getChannelInfos().name ? cnm.getChannelInfos().name : ''
      })
    })
  },
  /**
   * 初始化
   */
  initLoad (loading) {
    this.loadData('Banner', loading)
    this.loadData('CateProduct', loading)
    this.loadData('Campaign', loading)
    um.getChannelASync().then(channel => {
      if (channel == 'ykyw') { // 私域名称公益低价药和其他不一样
        this.data.categoryListDefault[1].name = '补贴专享'
      } 
      else if (channel == 'hkk') { 
        this.data.categoryListDefault = this.data.categoryListDefault[2]
      }
      else {
        this.data.categoryListDefault[1].name = '公益低价药'
      }
      this.loadData('Category', loading)
    })
  },

  /**
   * 页面事件
   */
  onMemberClick () {
    this.$to('registerMember/registerMember')
  },
  // banner点击
  onBannerClick (e) {
    const { item } = e.currentTarget.dataset
    navigateByInfo(item)
  },
  // 关键词搜索
  onSearchClick () {
    this.$to(`search/search`, 'navigate')
  },
  // 行业资质跳转
  onIndustryQualificationClick () {
    let currentChannel = this.data.currentChannel
    this.$to(`industryQualification/industryQualification?currentChannel=${currentChannel}`, 'navigate')
  },
  // 跳转待领取优惠券
  onCouponClick () {
    this.$to(`couponRedemption/couponRedemption`)
  },
  onView () {
    this.$to('agentManage/agentManage')
  },
  // 商品点击
  onGoodsClick (e) {
    const { id } = e.currentTarget.dataset
    this.$to(`goodsDetail/goodsDetail?id=${id}`, 'navigate')
  },
  // 分类点击
  onCategoryClick (e) {
    const { detail } = e.currentTarget.dataset
    if (detail.type == 'page') {
      this.$to(detail.path + `?title=${detail.name}`, 'navigate')
    } else {
      this.$to(`goodsList/goodsList?id=${detail.externalIdentity}`, 'navigate')
    }
  },
  // 所有系列点击
  onAllSeriesClick () {
    this.$to('series/series', 'navigate')
  },
  // 新人专享更多点击
  onNewPeopleMoreClick () {
    this.$to('exclusiveForNewPeople/exclusiveForNewPeople', 'navigate')
  },
  onNewMoreClick (e) {
    const { id } = e.currentTarget.dataset
    this.$to(`goodsList/goodsList?id=${id}`, 'navigate')
  },
  // 新人专享第一个红包点击
  onCampaignCouponClick () {
    this.$to('couponCenter/couponCenter', 'navigate')
  },
  // 新人专享后面的商品 item 点击
  onExclusiveForNewPeopleClick (e) {
    const { item } = e.currentTarget.dataset
    if (!item.stock) return
    this.$to(`goodsDetail/goodsDetail?id=${item.spuId}`, 'navigate')
  },

  /**
   * 网络请求
   */
  // 根据类型请求对应模块
  loadData (type, loading) {
    getCmsByType(type, loading, (data) => {
      wx.stopPullDownRefresh()
      switch (type) {
        case 'Banner':
          this.setData({
            bannerList: data.items || [],
          })
          break
        case 'Category':
          if (data && data.items) {
            console.log("data.items",data.items);
            let tempData = data.items.concat(this.data.categoryListDefault)
            this.setData({
              categoryList: tempData,
            })
            console.log("tempData",tempData);
          } else {
            this.setData({
              categoryList: [],
            })
          }
          break
        case 'Campaign':
          this.setData({
            campaignObj: data.items && data.items[0] && data.items[0].couponRuleDto ? handleCouponUtilFun(data.items[0].couponRuleDto) : {},
            exclusiveForNewPeople: data.items && data.items[0] && data.items[0].campaign && data.items[0].campaign.products ? this.handlerProduct(data.items[0].campaign.products) : [],
          })
          break
        default:
          const seriesList = (data.items || []).map(val => {
            const products = val.products.splice(0,10)
            products.map(pro => {
              pro.saleTotalStr = (pro.saleTotal || 0) + (pro.realSaleTotal || 0) > 9999 ? '9999+' : (pro.saleTotal || 0) + (pro.realSaleTotal || 0)
              return pro
            })
            return { ...val, products }
          })
          this.setData({
            seriesList
          })
          break
      }
      this.$hideLoading()
    })
  },
  // 禁用的商品不显示
  handlerProduct (list) {
    return list.filter((item) => {
      return !!item.enabled
    })
  },
  onExclusiveForNewPeopleError(e) {
    var index = e.currentTarget.dataset.index
    var list = this.data.exclusiveForNewPeople
    let newList = JSON.parse(JSON.stringify(list));
    newList[index].imgUrl = '../../assets/image/defaultImg.png'
    this.setData({
      exclusiveForNewPeople: newList
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage () {
    return sm.userShare()
  },

  onShareTimeline () {
    return sm.userShare()
  }
})
