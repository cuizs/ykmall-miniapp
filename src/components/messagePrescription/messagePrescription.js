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
        let patientInfo = ''
        let diseaseName = ''
        let inquiryContent = null
        let prescriptionDrugList = []
        let cardName = ''
        if (nVal.contentType === 'im_prescription_refusal') {
          // 驳回处方单
          try {
            inquiryContent = JSON.parse(nVal.content || JSON.stringify({}))
            patientInfo = `${'*' + inquiryContent.content.patientName.slice(1)} ${inquiryContent.content.patientSex === '1' ? '男' : '女'} ${inquiryContent.content.patientAge || '34'}岁`
            diseaseName = inquiryContent.content.diseaseName
            prescriptionDrugList = inquiryContent.content.prescriptionDrugList
            cardName = "处方单"
          } catch (err) {
            console.log(err)
          }
        } else if (nVal.contentType === 'im_prescription') {
          // 通过处方单
          const inquiryBase = this.properties.inquiryBase
          inquiryContent = JSON.parse(nVal.content || JSON.stringify({}))
          diseaseName = inquiryContent.diseaseName
          patientInfo = `${'*' + inquiryBase.patientName.slice(1)} ${inquiryBase.sex ? inquiryBase.sex === '1' ? '男' : '女' : ''} ${inquiryBase.age ? inquiryBase.age : ''}岁`
          prescriptionDrugList = inquiryContent.drugNames.split('、').map(val => ({ drugName: val }))
          cardName = "处方单"

        } else if (nVal.contentType === 'im_advise') {
          const inquiryBase = this.properties.inquiryBase
          inquiryContent = JSON.parse(nVal.content || JSON.stringify({}))
          diseaseName = inquiryContent.desc.diseaseName
          patientInfo = `${'*' + inquiryBase.patientName.slice(1)} ${inquiryBase.sex ? inquiryBase.sex === '1' ? '男' : '女' : ''} ${inquiryBase.age ? inquiryBase.age : ''}岁`
          prescriptionDrugList = inquiryContent.newArr
          cardName = "医生建议"
        }
        this.setData({
          inquiryContent,
          patientInfo,
          diseaseName,
          prescriptionDrugList,
          cardName
        })
      }
    },
    status: {
      type: Number,
      value: 0, // 0 驳回 1 同意
    },
    inquiryBase: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    patientInfo: '',
    inquiryContent: {},
    diseaseName: '',
    cardName: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    btnClick: function (e) {
      this.triggerEvent('click')
    }
  }
})
