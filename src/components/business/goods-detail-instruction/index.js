/**
 * 详情页面底部购买组件
 */
import { insPop} from './_config'
Component({
  externalClasses: ['z-class'],

  // 属性
  properties: {
    goods: {
      type: Object,
      value: {},
      observer: function (newVal) {
        if(newVal && newVal.id){
          let insPopValue = {}
          this.data.insPop.forEach(element => {
            if(element.key == 'specsStr' && newVal.specs) { // 规格需要先处理一下
              let str = ''
              newVal.specs.forEach((itm, idx)=>{
                itm.values.forEach((i, d)=>{
                  if(idx == 0 && d == 0) {
                    str = str + i.value
                  }else {
                    str = str + '、' + i.value
                  }
                })
              })
              newVal.specsStr = str
            }
            insPopValue[element.key] = newVal[element.key] ? newVal[element.key].replace(/\<img/gi, '<img mode="widthFix" class="richTextImg"').replace(/\<ol/gi, '<ol class="richTextOl"').replace(/\<ul/gi, '<ul class="richTextUl"')
            : '尚不明确'
          });
          this.setData({
            insPopValue
          })
        }
      }
    }
  },
  // 组件数据
  data: {
    show: false,
    insPop,
    insPopValue: {}
  },

  // 组件所在页面的生命周期
  lifetimes: {
    ready() {
      
    }
  },

  // 组件方法
  methods: {
    /**
     * 页面事件
     */
    onShow () { this.setData({show:true})},
    onClose () {
      this.setData({show:false})
    }
  }
})
