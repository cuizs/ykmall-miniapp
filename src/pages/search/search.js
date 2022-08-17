import { keywordList, getGoodsList } from './_service'
import kw from '../../manager/keyword'
import { navigateByInfo } from '../../manager/navigate'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 自动对焦
    focus: false,
    def: '搜索',
    recently: [],
    hot: [],
    list: [],
    // 显示搜索内容
    show: false
  },

  /**
   * 生命周期函数
   */
  onLoad(options) {
    // 获取最近搜索
    kw.get(data => {
      this.setData({
        recently: data || []
      })
    })
    // 获取热门搜索
    keywordList(hot => {
      this.setData({
        hot
      })
    })
  },
  onShow() {
    this.setData({ focus: true })
  },
  /**
   * 页面事件
   */
  // 搜索
  confirm(e) {
    const { value } = e.detail
    this.setData({
      show: !!value
    })
    if (value) {
      kw.set(value, data => {
        this.setData({
          recently: data || []
        })
      })
      getGoodsList(
        { keyword: value, isGroup: 0, status: 'Enable', pageNo: 1, pageSize: 50,displayHidden:false
      },
        data => {
          this.setData({ list: data.results })
        }
      )
    }
  },
  // 清空最近搜索
  ondel() {
    kw.remove()
    this.setData({ recently: [] })
  },
  //跳转商品详情页面
  onGoodClick(e) {
    const { id } = e.currentTarget.dataset
    this.$to(`goodsDetail/goodsDetail?id=${id}`, 'navigate')
  },
  // 点击热门发现
  onActionClick(e) {
    const { item } = e.currentTarget.dataset
    console.log(item)
    navigateByInfo(item)
  },
  onHistoryKeywordClick(e) {
    const { keyword } = e.currentTarget.dataset
    getGoodsList(
      { keyword: keyword, isGroup: 0, status: 'Enable', pageNo: 1, pageSize: 50,displayHidden:false
    },
      data => {
        this.setData({ show: true, list: data.results })
      }
    )
  },
  onImageError(e) {
    var index = e.currentTarget.dataset.index
    var list = this.data.list
    let newList = JSON.parse(JSON.stringify(list));
    newList[index].imgUrl = '../../assets/image/defaultImg.png'
    this.setData({
      list: newList
    })
  }
})
