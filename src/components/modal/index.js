/**
 * 模态框组件
 */

Component({
  externalClasses: ['z-class'],
  data: {
    // 控制 modal 显示
    visable: false,
    // 距离屏幕上方距离 单位vh
    top: 30,
    // 标题
    title: '',
    // 是否显示Title
    showTitle: true,
    // 内容
    content: '',
    // 取消按钮文案
    cancelText: '',
    // 确定按钮文案
    certainText: '',
    // 是否显示取消按钮
    showCancel: true,
    // 取消事件回调
    cancelFunc: null,
    // 确认事件回调
    certainFunc: null,

    // 是否自动关闭。
    // 若为false，点击确认按钮则不自动隐藏
    autoClose: true
  },
  methods: {
    /**
     * 页面事件
     */
    // 用来防止滑动穿透
    _onTouchMove() {},

    // 取消点击事件
    _onCancelClick() {
      this.data.cancelFunc && this.data.cancelFunc()
      this.close()
    },

    // 确认点击事件
    _onCertainClick() {
      this.data.certainFunc && this.data.certainFunc()
      this.data.autoClose && this.close()
    },

    /**
     * 对外提供显示 modal 方法
     */
    // 显示
    show(objc = {}) {
      this.setData({
        visable: true,
        top: objc.top === undefined ? 30 : objc.top,
        title: objc.title || '提示',
        showTitle: objc.showTitle === undefined ? true : objc.showTitle,
        content: objc.content || '',
        cancelText: objc.cancelText || '取消',
        certainText: objc.certainText || '确定',
        showCancel: objc.showCancel === undefined ? true : objc.showCancel,
        cancelFunc: objc.cancelFunc || null,
        certainFunc: objc.certainFunc || null,
        autoClose: objc.autoClose === undefined ? true : objc.autoClose
      })
    },
    // 隐藏
    close() {
      this.setData({
        visable: false
      })
    }
  }
})
