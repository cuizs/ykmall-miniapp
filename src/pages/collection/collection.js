import { collectGoods } from './_service'
import um from '../../manager/userInfo'

Page({
  /**
   * 非页面渲染数据
   */
  extData: {
    // 分页器
    pagination: {
      pageNo: 1,
      pageSize: 10,
      total: Infinity,
      displayHidden:false
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    // 商品列表
    list: [],
    // 没有任何商品时候显示
    pageShow: false,
    storeChannel:""
  },

  /**
   * 生命周期函数
   */
  onShow () {
    //获取店铺渠道
    let storeChannel = um.getCurrentChannel()
    this.setData({ storeChannel: storeChannel})
    console.log('this.data.storeChannel',this.data.storeChannel);
    this.getCollectGoods()
  },
  // 监听用户上拉触底事件
  onReachBottom () {
    // 商品全部加载完 停止下拉加载事件
    this.getCollectGoods(true)
  },
  /**
   * 页面事件
   */
  // 商品 cell 点击
  onCellClick (e) {
    const { id } = e.currentTarget.dataset
    this.$to(`goodsDetail/goodsDetail?id=${id}`, 'navigate')
  },

  /**
   * 数据处理
   */
  // 获取商品列表
  getCollectGoods (load = false) {
    let { list } = this.data
    const { pagination } = this.extData
    if (pagination.total === list.length && load) return
    // 非上拉操作，页数置为1
    if (!load) pagination.pageNo = 1
    const params = this.extData.pagination
    collectGoods(params, !load, data => {
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
      console.log(list)
    })
  }
})
