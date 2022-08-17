/**
 * search bar 组件
 */

Component({
  externalClasses: ['z-class'],
  properties: {},

  methods: {
    onConfirmClick(e) {
      this.triggerEvent('search', { ...e })
    }
  }
})
