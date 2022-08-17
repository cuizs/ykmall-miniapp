import { getCategoryList } from './_service'
import cm from '../../manager/cart'
import { naviBarHeight, viewportHeight } from '../../components/mixin'
import sm from '../../manager/share'
import dm from '../../manager/demand'
// 同 less 文件中 @category-search-height 相同
const SEARCH_BAR_HEIGHT = 41

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 当前分类下标
    currentIdx: 0,
    // 当前分类
    currentCategory: {},
    // 分类列表
    categoryList: [],
    // 当前分类 子分类
    currentSubList: [],
    // 导航栏高度
    barHeight: naviBarHeight(),
    // 内容 scroll view 的高度
    scrollViewHeight: viewportHeight() - SEARCH_BAR_HEIGHT,
  },

  /**
   * 生命周期函数
   */
  onLoad() {
    this.$initLoading()
    this.$showLoading()
  },
  onShow() {
    const query = this.$getRouterQuery('routerQuery') || {}
    getCategoryList((data) => {
      this.$hideLoading()
      this.handleLoadDataById(query.id, data)
    })
    dm.fetchDemandCount()
    cm.fetchCartCount()
  },
  onReady() {
    console.log('viewportHeight: ', viewportHeight())
  },

  /**
   * 页面事件
   */
  // 左侧 分类 点击
  // 关键词搜索
  onSearchClick() {
    this.$to(`search/search`, 'navigate')
  },
  onMenuClick(e) {
    const { categoryList } = this.data
    const { index } = e.currentTarget.dataset
    this.setData({
      currentIdx: index,
      currentCategory: categoryList[index] || {},
      currentSubList: categoryList[index].children,
    })
  },
  // 右侧 分类 点击
  onSubCategoryClick(e) {
    const { item } = e.currentTarget.dataset
    let path = 'goodsList/goodsList'
    if (item) {
      path = `${path}?id=${item.id}&name=${item.name}`
    }
    this.$to(path, 'navigate')
  },
  onAllClick() {
    this.$to('goodsList/goodsList', 'navigate')
  },
  // 根据左侧id获取商品列表
  onGoodsListByIdClick() {
    const { categoryList } = this.data
    const item = categoryList[this.data.currentIdx]
    this.$to(`goodsList/goodsList?id=${item.id}&name=${item.name}`, 'navigate')
  },
  // 关键字搜索
  onSearchClick(e) {
    this.$to('search/search')
  },

  /**
   * 数据处理
   */
  handleLoadDataById(id, list) {
    if (id) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item.id == id) {
          this.setData({
            currentIdx: i,
            categoryList: list,
            currentCategory: list[i],
            currentSubList: item.children,
          })
          break
        }
      }
    } else {
      const { currentIdx } = this.data
      this.setData({
        currentIdx,
        categoryList: list,
        currentCategory: list[currentIdx],
        currentSubList: list[currentIdx] ? list[currentIdx].children : [],
      })
    }
  },
  onShareAppMessage() {
    return sm.userShare()
  },
  onShareTimeline() {
    return sm.userShare()
  }
})
