/**
 * 筛选组件
 */
import { naviBarHeight } from '../mixin'
import { SORT_TYPE, DEFALUT_LIST } from './config'

Component({
  externalClasses: ['z-class'],
  properties: {
    list: {
      type: Array,
      value: DEFALUT_LIST
    },
    keyword:{
      type: String,
      value:''
    },
    inputFocus:{
      type:Boolean,
      value:false
    }
  },
  data: {
    currentIdx: 0,
    barHeight: naviBarHeight()
  },
  methods: {
    // 选择点击事件
    onCellClick(e) {
      const { index, type } = e.currentTarget.dataset
      const { list } = this.data
      const item = list[index]
      switch (type) {
        case 'radio':
          this.triggerEvent('onClick', { value: item })
          break
        case 'sort':
          item.sortType = item.sortType === 'asc' ? SORT_TYPE('desc') : SORT_TYPE('asc')
          this.triggerEvent('onClick', { value: item })
          break
        default:
          console.warn(`invalid type: ${type}`)
      }
      this.setData({
        list,
        currentIdx: index
      })
    },
    // 搜索事件
    onConfirmClick(e){
     
     wx.navigateTo({
       url: '/pages/search/search'
     });
    },
  }
})
