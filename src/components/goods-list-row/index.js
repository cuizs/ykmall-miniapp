Component({
  externalClasses: ['sol-class'],
  properties: {
    goodsList: {
      type: Array,
      value: [],
    },
    type: {
      type: String,
      value: '',
    },
  },
  data: {
    format: ['天', ':', ':', ':'],
    interval: 1 * 24 * 60 * 60,
    imgDefault: '../../assets/image/logo_default.png',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGoodClick(e) {
      const { id, item } = e.currentTarget.dataset
      this.triggerEvent('onGoodClick', {
        id: id,
        item: item,
      })
    },
    onMaskClick(e) {
      console.info('onMaskClick', e)
    },
    endTimeFn(e) {
      console.info('endTimeFn', e)
    },
  },
})
