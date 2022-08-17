import { getCategoryList } from './_service'

Component({
  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [],
    currentId: ''
  },

  /**
   * 生命周期函数
   */
  ready() {
    getCategoryList(false, data => {
      this.setData({
        categoryList: data
      })
    })
  },
  /**
   * 页面事件
   */
  // 左侧 分类 点击
  methods: {
    onMenuClick(e) {
      const { id } = e.currentTarget.dataset
      this.setData({
        currentId: id
      })
      this.triggerEvent('chooseClick', id)
    }
  }
})
