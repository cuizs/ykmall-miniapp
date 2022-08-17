/**
 * 滑动菜单
 */

Component({
  externalClasses: ['z-class'],
  properties: {
    // 操作按钮
    /** 配置属性
     * [{
     *    label: '',
     *    icon: '',
     *    background: '',
     *    color: '',
     *    size: '',
     *    width: 100
     * }]
     */
    actions: {
      value: [],
      type: Array,
      observer: '_updateButtonSize'
    },
    // 点击操作是否关闭
    unclosable: {
      value: false,
      type: Boolean
    },
    // 操作面板宽度
    operateWidth: {
      type: Number,
      value: 160
    }
  },
  options: {
    multipleSlots: true
  },
  data: {
    // 限制滑动距离
    limitMove: 0,
    // touch start position
    tStart: { pageX: 0, pageY: 0 },
    // element move position
    position: { pageX: 0, pageY: 0 }
  },
  ready() {
    this._updateButtonSize()
  },
  methods: {
    // 阻止事件冒泡
    stopLoop() {},
    // touch start
    handlerTouchstart(event) {
      const { tStart } = this.data
      const touches = event.touches ? event.touches[0] : {}
      for (let i in tStart) {
        if (touches[i]) {
          tStart[i] = touches[i] || 0
        }
      }
    },
    // touch move
    handlerTouchmove(event) {
      const { tStart } = this.data
      const touches = event.touches ? event.touches[0] : {}
      const direction = this.swipeDirection(
        tStart.pageX,
        touches.pageX,
        tStart.pageY,
        touches.pageY
      )
      direction === 'Left' && this.swipper(touches)
    },
    // touch end
    handlerTouchend(event) {
      const { tStart } = this.data
      const touches = event.changedTouches ? event.changedTouches[0] : {}
      const direction = this.swipeDirection(
        tStart.pageX,
        touches.pageX,
        tStart.pageY,
        touches.pageY
      )
      const spacing = {
        pageX: touches.pageX - tStart.pageX,
        pageY: touches.pageY - tStart.pageY
      }
      if (Math.abs(spacing.pageX) >= 40 && direction === 'Left') {
        spacing.pageX =
          spacing.pageX < 0 ? -this.data.limitMove : this.data.limitMove
      } else {
        spacing.pageX = 0
      }
      this.setData({
        position: spacing
      })
    },
    // actuons配置button点击事件
    handlerButton(event) {
      !this.data.unclosable && this.closeButtonGroup()
      const dataset = event.currentTarget.dataset
      this.triggerEvent('change', {
        index: dataset.index
      })
    },
    // 控制自定义组件
    handlerParentButton() {
      !this.data.unclosable && this.closeButtonGroup()
    },

    /**
     * 数据处理
     */
    // 关闭操作
    closeButtonGroup() {
      this.setData({
        position: { pageX: 0, pageY: 0 }
      })
    },
    // 左侧button总宽度
    _updateButtonSize() {
      const { actions } = this.data
      if (actions.length > 0) {
        let limitMovePosition = 0
        actions.forEach(item => {
          limitMovePosition += item.width || 0
        })
        this.data.limitMove = limitMovePosition
      } else {
        this.data.limitMove = this.data.operateWidth
      }
    },
    // 判断滑动方向
    swipeDirection(x1, x2, y1, y2) {
      const absOfX = Math.abs(x1 - x2)
      const absOfy = Math.abs(y1 - y2)
      return absOfX >= absOfy
        ? x1 - x2 > 0
          ? 'Left'
          : 'Right'
        : y1 - y2 > 0
        ? 'Up'
        : 'Down'
    },
    // 计算初始触点也滑动的距离差值
    swipper(touches) {
      const data = this.data
      const { tStart } = data
      const spacing = {
        pageX: touches.pageX - tStart.pageX,
        pageY: touches.pageY - tStart.pageY
      }
      if (data.limitMove < Math.abs(spacing.pageX)) {
        spacing.pageX = -data.limitMove
      }
      this.setData({
        position: spacing
      })
    }
  }
})
