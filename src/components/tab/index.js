Component({
  externalClasses: ['z-class'],
  relations: {
    '../tab-group/index': {
      type: 'parent'
    }
  },
  properties: {
    index: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    color: ''
  },
  methods: {
    changeTab(e) {
      const index = e.target.dataset.index
      if (this.data.current === index) return
      const parent = this.getRelationNodes('../tab-group/index')
      parent[0]._changeTab(index)
    },
    _updateChange(current, color) {
      this.setData({
        current,
        color
      })
    }
  }
})
