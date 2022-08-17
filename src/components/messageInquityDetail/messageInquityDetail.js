// components/messageText.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {},
      observer: function (nVal) {
        console.log('dada', nVal)
        const inquiryContent = JSON.parse(nVal.content || JSON.stringify({}))
        this.setData({
          inquiryContent
        })
      }
    },
    inquiryBase: {
      type: Object,
      value: {},
      observer: function (nVal) {
        this.setData({
          // patientInfo: { ...patientInfo, name: nVal.patientName, age: nVal.age, sex: nVal.sex }
          patientInfo: `${'*' + nVal.patientName.slice(1)} ${nVal.sex == '1' ? '男' : '女'} ${nVal.age || '34'}岁`
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    patientInfo: '',
    inquiryContent: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
