import {
  getDragUserDetail,
  postPrescription,
  getSkusDiseasesDetailByIds,
  getDragUserList,
} from './_service'
import Upload from '../../utils/network/upload.http'
import local from '../../utils/localStorage'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 由下一个页面-用药人列表，所选后返回带回来的
    selectedDragUserId: '',
    dragUserDetail: {},
    seenDoctor: 'true',
    adverseReactions: 'false',
    // 确诊疾病配置
    confirmedDiseasesConfig: [],
    // 文件上传后的 list
    tempUrls: [],
    // 显示示例的病例
    showDemo: false,
    demoPath: '',
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
        if (local.get('_prescriptionData_')) {
          let originData = JSON.parse(local.get('_prescriptionData_'));
          this.setData({
            adverseReactions: originData.adverseReactions ? 'true' : 'false',
            seenDoctor: originData.seenDoctor ? 'true' : 'false',
            tempUrls: originData.medicalRecordUrl,
            selectedDragUserId: originData.dragUserId,
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    this.getdragUserDetailById()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () { },

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
            dragUserDetail: detail,
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
        let list = data ? data : []
        self.setData({
          selectedDragUserId: list.length > 0 ? list[0].id : null
        })
        self.getdragUserDetailById()
      })
    } else {
      self.getdragUserDetailById()
    }
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

  onSeenDoctorChange (e) {
    this.setData({
      seenDoctor: e.detail,
    })
  },
  onAdverseReactionsChange (e) {
    this.setData({
      adverseReactions: e.detail,
    })
  },

  onClickUserMore () {
    this.$to(`dragUserList/dragUserList`, 'navigate')
  },

  // 添加补充病历
  chooseImage () {
    let self = this

    Upload.image({
      count: 9 - this.data.tempUrls.length,
      success: (res) => {
        let list = self.data.tempUrls.concat(res)
        self.setData({
          tempUrls: list,
        })
      },
    })
  },

  // 预览照片
  previewImage (e) {
    let { img, imgs } = e.currentTarget.dataset
    wx.previewImage({
      current: img,
      urls: imgs,
    })
  },

  delImage (e) {
    let { index } = e.currentTarget.dataset
    this.data.tempUrls.splice(index, 1)
    this.setData({
      tempUrls: this.data.tempUrls,
    })
  },

  submitPrescription () {
    if (!this.data.selectedDragUserId) {
      wx.showToast({
        title: '请先选择用药人',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    let confirmedDiseases = []
    let confirmedDiseasesInfo = []
    this.data.confirmedDiseasesConfig.forEach((item) => {
      if (item.isSelected) {
        confirmedDiseases.push(item.code)
        confirmedDiseasesInfo.push(item.name)
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
    if (
      this.data.seenDoctor == 'false' ||
      this.data.adverseReactions == 'true'
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
            this.uploadPrescriptionData(confirmedDiseases, confirmedDiseasesInfo);
          }
        }
      })
      return false
    }
    this.uploadPrescriptionData(confirmedDiseases, confirmedDiseasesInfo);
  },

  uploadPrescriptionData (confirmedDiseases, confirmedDiseasesInfo) {
    let data = {
      name: '',
      adverseReactions: this.data.adverseReactions === 'true',
      seenDoctor: this.data.seenDoctor === 'true',
      confirmedDiseases: confirmedDiseases,
      confirmedDiseasesInfo: confirmedDiseasesInfo,
      medicalRecordUrl: this.data.tempUrls,
      dragUserId: this.data.selectedDragUserId,
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
  onClickHide () {
    this.setData({ showDemo: false });
  },
  demoClick (e) {
    let { index } = e.currentTarget.dataset;
    let path = index == 1 ? 'https://ykyao-mall.oss-cn-shanghai.aliyuncs.com/prod/sHI1Cl1659060345367.jpg' : 'https://ykyao-mall.oss-cn-shanghai.aliyuncs.com/prod/Xt0Bdx1659060369448.jpg'
    this.setData({
      showDemo: true,
      demoPath: path
    });
  }
})
