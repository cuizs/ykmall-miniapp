// pages/prescribe.js
import { postPrescription, getSkusDiseasesDetailByIds, getDragUserDetail, getDragUserList } from "./_service";
import local from '../../utils/localStorage'
import Upload from '../../utils/network/upload.http'
import { isAllSpace } from '../../utils/util'
import { showToast } from "../../utils/network/_handler/toast.handler";
import { debounce } from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 由下一个页面-用药人列表，所选后返回带回来的
    selectedDragUserId: '',
    dragUserDetail: null,
    policyChecked: false,
    confirmedDiseasesConfig: [],
    diseasesInfo: '',
    adverseReactions: true,
    seenDoctor: false,
    tempUrls: [
      // {
      //   url: 'https://img.yzcdn.cn/vant/leaf.jpg',
      //   name: '图片1',
      // },
      // // Uploader 根据文件后缀来判断是否为图片文件
      // // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
      // {
      //   url: 'http://iph.href.lu/60x60?text=default',
      //   name: '图片2',
      //   isImage: true,
      //   deletable: true,
      // },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    if (options.skuIds) {
      let config = []
      getSkusDiseasesDetailByIds(options.skuIds, (data) => {
        console.log("data====", data);
        data.forEach((item) => {
          config.push({
            name: item.name,
            code: item.code,
            isSelected: item.name == '无',
          })
        })
        this.setData({
          confirmedDiseasesConfig: config,
        })
        console.log('confirmedDiseasesConfig', this.data.confirmedDiseasesConfig)
        if (local.get('_prescriptionData_')) {
          let originData = JSON.parse(local.get('_prescriptionData_'));
          this.setData({
            adverseReactions: originData.adverseReactions,
            seenDoctor: originData.seenDoctor,
            tempUrls: originData.medicalRecordUrl,
            selectedDragUserId: originData.dragUserId,
            diseasesInfo: originData.diseasesInfo,

          })
          let list = originData.confirmedDiseases
          let confirmedDiseasesConfig = this.data.confirmedDiseasesConfig
          console.log(confirmedDiseasesConfig, list);
          confirmedDiseasesConfig.forEach(itm => {
            let i = list.forEach(ele => {
              if (ele == itm.code) {
                itm.isSelected = true;
              }
            })
            return itm
          })
          this.setData({
            confirmedDiseasesConfig: confirmedDiseasesConfig,
          })
        }
        this.setDefaultUser()
      })
    }
  },
  onDiseasesInfoChange (e) {
    console.log(e)
    this.setData({
      diseasesInfo: e.detail.value.slice(0, 500)
    })
  },

  onPolicyCheckedChange (e) {
    this.setData({
      policyChecked: e.detail,
      seenDoctor: true,
      adverseReactions: false
    })
  },
  // 点击选择确诊疾病
  onClickDiseases (e) {
    let { name } = e.currentTarget.dataset
    this.data.confirmedDiseasesConfig.forEach((item, index) => {
      if (item.name === name) {
        this.setData({
          [`confirmedDiseasesConfig[${index}].isSelected`]: !item.isSelected,
        })
      }
    })
  },
  onSelectDragUser () {
    this.$to('dragUserList/dragUserList')
  },
  // 获取用药人信息详情
  getdragUserDetailById () {
    if (this.data.selectedDragUserId) {
      getDragUserDetail(this.data.selectedDragUserId, (res) => {
        if (res && Object.keys(res).length > 0) {
          let detail = {
            ...res,
            noPassByMobile: res.mobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2'),
          }
          this.setData({
            dragUserDetail: { ...detail, name: detail.name.length > 3 ? `${detail.name.slice(0, 3)}...` : detail.name },
          })
        }
      })
    }
  },
  setDefaultUser () {
    let self = this
    // 没有默认选中的患者，则默认选中第一个
    if (!self.data.selectedDragUserId) {
      getDragUserList(data => {

        console.log('getDragUserList', data)
        let list = data ? data : []
        self.setData({
          selectedDragUserId: list.length > 0 ? (list.find(l => !!l.defaultUser) || {}).id : null
        })
        self.getdragUserDetailById()
      })
    } else {
      self.getdragUserDetailById()
    }
  },
  onTempUrlsChange () {
    if (this.data.tempUrls.length >= 9) {
      wx.showToast({
        title: '最多上传9张图片！',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    const _this = this
    Upload.image({
      count: 9 - this.data.tempUrls.length,
      success: (res) => {
        const tempUrls = JSON.parse(JSON.stringify(_this.data.tempUrls || [])).concat(res)
        _this.setData({
          tempUrls
        })
      }
    })

  },
  deleteTempUrl (e) {
    const url = e.currentTarget.dataset.url
    const tempUrls = JSON.parse(JSON.stringify(this.data.tempUrls || [])).filter(item => item !== url)
    this.setData({
      tempUrls
    })
  },
  submitPrescription: debounce(function () {
    if (!this.data.selectedDragUserId) {
      wx.showToast({
        title: '请先选择用药人',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    if (!this.data.dragUserDetail.province) {
      wx.showToast({
        title: '当前用药人信息未完善',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    let confirmedDiseases = []
    this.data.confirmedDiseasesConfig.forEach((item) => {
      if (item.isSelected) {
        confirmedDiseases.push(item.code)
      }
    })
    if (confirmedDiseases.length === 0) {
      wx.showToast({
        title: '请选择确诊疾病',
        icon: 'none',
        duration: 2000,
      })
      return false
    }

    if (this.data.diseasesInfo.length < 10 || this.data.diseasesInfo.length > 500 || isAllSpace(this.data.diseasesInfo)) {
      wx.showToast({
        title: '请填写10~500字的病情描述',
        icon: 'none',
        duration: 2000,
      })
      return false
    }

    if (
      !this.data.seenDoctor ||
      this.data.adverseReactions ||
      !this.data.policyChecked
    ) {
      wx.showToast({
        title: '不是复诊患者或有不良反应，建议到线下医院就诊。',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    if (this.data.tempUrls.length === 0) {
      wx.showModal({
        title: '复诊凭证遗失或不在身边？',
        content: '请确认您在线下医院就诊过，但此刻复诊凭证丢失或不在身边。无历史处方、病历、住院出院记录可能会影响医生对您的病情判断。',
        confirmText: '确定',
        success: res => {
          if (res.confirm) {
            this.uploadPrescriptionData(confirmedDiseases);
          }
        }
      })
      return false
    }
    this.uploadPrescriptionData(confirmedDiseases);
  }, 1000),

  uploadPrescriptionData (confirmedDiseases) {
    let data = {
      name: '',
      adverseReactions: this.data.adverseReactions,
      seenDoctor: this.data.seenDoctor,
      confirmedDiseases: confirmedDiseases,
      medicalRecordUrl: this.data.tempUrls,
      dragUserId: this.data.selectedDragUserId,
      diseasesInfo: this.data.diseasesInfo,
    }
    postPrescription(data, (res) => {
      local.set('_recipeNumber_', res)
      local.set('_prescriptionData_', JSON.stringify(data));
      wx.showToast({ title: '提交成功' })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1500)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setDefaultUser()
    // this.getdragUserDetailById()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})