/**
 * list组件
 */

Component({
  externalClasses: ['z-class'],
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onMemberClick() {
      const { data } = this.data
      if (!data.level || data.level != 'Vip') {
        wx.navigateTo({
          url: '/pages/customerEquity/customerEquity'
        })
      }
    }
  }
})
