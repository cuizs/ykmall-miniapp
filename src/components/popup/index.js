Component({
  // 记录时间戳
  timer: null,
  /**
   * 页面的初始数据
   */
  properties: {
    // 侧边栏宽度(默认70[vw,vh])
    size: {
      type: Number,
      value: ''
    },
    // 方向 (up=> 底出 || down=> 上出 || left=> 左出 || right=> 右出)
    direction: {
      type: String,
      value: ''
    },
    // 是否允许点击遮罩层关闭
    maskClosable: {
      type: Boolean,
      value: true
    }
  },
  data: {
    // 控制抽屉显示
    visible: false
  },
  methods: {
    // 显示抽屉(对外提供)
    showDrawer() {
      this._drawerHandler(true)
      this.triggerEvent('onChange', { visable: true })
    },
    // 关闭
    onCloseClick() {
      this.triggerEvent('onClose', { visable: false })
      this._drawerHandler(false)
    },
    // 隐藏抽屉(对外提供)
    hideDrawer(e) {
      console.log(e)
      const type = e ? 'mask' : ''
      if (type === 'mask') {
        const { maskClosable } = this.data
        if (maskClosable) {
          this._drawerHandler(false)
          this.triggerEvent('onChange', { visable: false })
        }
      } else {
        this._drawerHandler(false)
        this.triggerEvent('onChange', { visable: false })
      }
    },

    // 禁止事件穿透
    _preventTouchMove() {},
    // 抽屉隐藏控制
    _drawerHandler(visible) {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.setData({
          visible: visible
        })
      }, 100)
    }
  }
})
