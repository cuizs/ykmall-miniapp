import { getGoodsList, getCouponGoodsList } from './_service'
import cnm from '../../manager/channel'
import um from '../../manager/userInfo'
Page({
  /**
   * 非页面渲染数据
   */
  extData: {
    // 过滤器
    filter: {
      // 关键字
      keyword: '',
      // 价格排序
      sortPrice: '',
      // 分类 id
      categoryId: '',
      // 事件排序
      sortCreateTime: '',
    },
    // 分页器
    pagination: {
      pageNo: 1,
      pageSize: 10,
      total: Infinity
    },
    // 页面传值
    options: {}
  },
  /**
   * 页面的初始数据
   */
  data: {
    // 商品列表
    list: [],
    // 没有任何商品时候显示
    pageShow: false,
    // 关键词搜索
    keyword: '',
    storeChannel:""
  },

  /**
   * 生命周期函数
   */
  onLoad (options) {
    this.extData.options = options
    const { keyword, id, inputFocus, couponCode } = this.extData.options
    const { filter } = this.extData
    filter.keyword = keyword
    filter.categoryId = id
    couponCode && (filter.couponCode = couponCode)
    this.getGoodsList()
    this.setData({
      keyword: keyword || '',
      inputFocus: inputFocus || false
    })
    //获取店铺渠道
    let storeChannel = um.getCurrentChannel()
    this.setData({ storeChannel: storeChannel})
    console.log('this.data.storeChannel',this.data.storeChannel);
  },
  onShow () {
    setTimeout(() => {
      this.setChannelTheme();
    }, 50);
  },
  // 监听用户上拉触底事件
  onReachBottom () {
    // 商品全部加载完 停止下拉加载事件
    this.getGoodsList(true)
  },
  /**
   * 页面事件
   */

  // 重置当前渠道自定义样式
  setChannelTheme () {
    const { options } = this.extData
    if (options.name) {
      wx.setNavigationBarTitle({
        title: options.name
      })
    } else {
      um.getChannelASync().then(channel => {
        wx.setNavigationBarTitle({
          title: cnm.getChannelInfos().name ? cnm.getChannelInfos().name : ''
        })
      })
    }
  },

  // 顶部 bar 点击
  onTabClick (e) {
    const { value } = e.detail
    const { filter } = this.extData
    console.log('value', value)
    switch (value.key) {
      case 'all':
        this.resetFilter()
        break
      case 'price':
        this.resetFilter()
        filter.sortPrice = value.sortType
        break
      case 'new':
        this.resetFilter()
        filter.sortCreateTime = value.sortType
        break
      case 'keyword':
        filter.keyword = value.keyword
        break
      default: {
        console.warn(`没有该类型: ${value.key}`)
      }
    }
    this.getGoodsList()
  },
  // 商品 cell 点击
  onCellClick (e) {
    const { id } = e.currentTarget.dataset
    this.$to(`goodsDetail/goodsDetail?id=${id}`, 'navigate')
  },

  /**
   * 数据处理
   */
  getGoodsListMethod () {
    const { options } = this.extData
    return options.couponCode ? getCouponGoodsList : getGoodsList
  },
  // 获取商品列表
  getGoodsList (load = false) {
    let { list } = this.data
    const { pagination } = this.extData
    if (pagination.total === list.length && load) return

    // 非上拉操作，页数置为1
    if (!load) pagination.pageNo = 1
    const params = this.getSearchStruct()
    this.getGoodsListMethod()(params, !load, data => {
      const results = data.results.map(val => {
        val.saleTotalStr = (val.saleTotal || 0) + (val.realSaleTotal || 0) > 9999 ? '9999+' : (val.saleTotal || 0) + (val.realSaleTotal || 0)
        return val
      })
      // 是否做上拉加载操作
      if (load) {
        list.push(...results)
      } else {
        list = results
      }
      pagination.total = data.total
      pagination.pageNo += 1
      this.setData({ list: list, pageShow: true })
    })
  },

  // 处理搜索数据
  getSearchStruct () {
    const { filter, pagination } = this.extData
    const temp = {}
    for (var key in filter) {
      if (filter[key]) temp[key] = filter[key]
    }
    return {
      isGroup: 0,
      ...temp,
      ...pagination,
      displayHidden:false
    }
  },
  // 重置数据
  resetFilter () {
    Object.assign(this.extData.filter, {
      sortPrice: '',
      sortCreateTime: '',
    })
  }
})
