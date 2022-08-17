/**
 * order item组件
 */

import { debounce } from "../../utils/util";

Component({
  externalClasses: ['z-class'],
  properties: {
    // 数据
    item: {
      type: Object,
      value: {
        title: '',
        subTitle: '',
        price: ''
      }
    },
    // 订单状态
    statusText: {
      type: String,
      value: ''
    },
    // 订单状态颜色
    statusColor: {
      type: String,
      value: ''
    },
    // 是否显示底部按钮
    optShow: {
      type: Boolean,
      value: true
    },
    showMoreKey: {
      type: Number,
      value: -1
    }
  },
  data: {
    // showMoreKey: null
  },

  /**
   * 页面事件
   */
  methods: {
    onImageError(e) {
      var index = e.currentTarget.dataset.index
      var list = this.data.item.orderLines
      let newList = JSON.parse(JSON.stringify(list));
      newList[index].imageUrl = '../../assets/image/defaultImg.png'
      this.setData({
       "item.orderLines": newList
      })
    },
    onBtnClick: debounce(function (e) {
      console.log(e)
      const { id, type, status, detail } = e.currentTarget.dataset
      this.triggerEvent('optclick', { id, type, status, detail })
    }, 300),
    // onBtnClick(e) {
    //   console.log(e)
    //   const {id, type, status, detail} = e.currentTarget.dataset
    //   this.triggerEvent('optclick', {id, type, status, detail})
    // },
    onMoreClick(e) {
      console.log(e.currentTarget.dataset.item)
      this.triggerEvent('moreclick', { key: e.currentTarget.dataset.item.id })
    }
  }
})
