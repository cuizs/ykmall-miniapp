/**
 * 详情页面底部购买组件
 */

Component({
  externalClasses: ['z-class'],

  // 属性
  properties: {
    productId: {
      type: String | Number,
      value: 0,
    },
    commentTotal: {
      type: Number,
      value: 0,
    },
    commentList: {
      type: Array,
      value: [],
    },
  },
  // 组件数据
  data: {
    show: false,
    likeIcon:"https://tmall.ykyao.com/oss/images/prescription/202203/d0c96e79-821c-44cb-881e-c0dc140f0065.png",
    noLikeIcon:"https://tmall.ykyao.com/oss/images/prescription/202203/1ba3c607-4f42-4ded-a38f-dc65d9f03106.png"
  },

  // 组件方法
  methods: {
    /**
     * 页面事件
     */
    onShow() {
      wx.navigateTo({
        url: `/pages/evaluateDetail/evaluateDetail?productId=${this.data.productId}&getAll=true`,
      })
    },
  },
})
