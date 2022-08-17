Component({
  externalClasses: ['z-class'],
  properties: {
    // 资源路径
    src: {
      type: String,
      value: ''
    },

    // 展示模式
    mode: {
      type: String,
      value: 'widthFix'
    },
    // 是否显示数量
    item: {
      type: Object,
      value: {}
    },
    // 显示提示
    hintText: {
      type: String,
      value: null
    }
  },
  data: {
    visible: false
  },
  ready() {
    this.showLoading()
  },
  methods: {
    // 图片加载完毕
    onImageLoad(e) {
      this.hideLoading()
    },

    // 图片加载失败
    onImageError(e) {
      this.hideLoading()
      this.setData({
        src:"../../assets/image/defaultImg.png"
      })
    },

    // 显示loading
    showLoading() {
      this.setData({
        visible: true
      })
    },

    // 隐藏loading
    hideLoading() {
      setTimeout(() => {
        this.setData({
          visible: false
        })
      }, 300)
    }
  }
})
