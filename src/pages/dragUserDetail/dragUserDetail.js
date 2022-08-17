import {
  postDragUser,
  getDragUserSYS,
  getDragUserDetail,
  putDragUser,
  getRegionData,
} from './_serivce'
import { isPhone, isCardNo } from '../../utils/util'
import um from '../../manager/userInfo'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 由用药人列表带过来的 id
    currentDragUserId: '',
    name: '',
    cardId: '',
    age: null,
    birthday: '',
    gender: '',
    mobile: '',
    verified: false,
    medicalHistories: [],
    id: '',
    merchantCode: '',
    createTime: '',
    customerId: '',
    guardianIdCard: '',
    guardianName: '',
    defaultUser: '',
    // 显示疾病史 popup
    showMedicalHistories: false,
    // 疾病史配置-处理过的
    medicalHistoriesConfig: [],
    // 疾病史输出文案
    medicalHistoriesText: '',
    currentChannel: '',
    multiArray: [],
    //省详细数据
    provinceDetailList: [],
    //城市详细数据
    cityDetailList: [],
    multiIndex: [null, null, null],
    province: '', //省id
    city: '', //市id
    area: '', //区
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.info('onLoad', options)
    this.setData({
      currentDragUserId: options.id,
    })
    this.init()
    this.getCurrentChannnel()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},
  // 页面初始化
  init() {
    let config = []
    this.handleDragUserSys().then((sysRes) => {
      this.getdragUserDetailById().then((detailRes) => {
        if (detailRes) {
          detailRes.medicalHistories.forEach((detailItem) => {
            let diseaseNameList = []
            if (detailItem.diseaseName) {
              detailItem.diseaseName.forEach((name) => {
                diseaseNameList.push({
                  name: name,
                  isSelect: true,
                })
              })
            }
            sysRes.forEach((sysItem) => {
              if (sysItem.code === detailItem.type) {
                // 关于妊娠哺乳状态的单独处理, 展示默认排序及选中的状态
                if (sysItem.code == 'BREASTFEEDING') {
                  let newList = []
                  for (const sysDiseaseNameItem of sysItem.diseaseNameList) {
                    const hasItem = diseaseNameList.find(
                      (i) => i && i.name === sysDiseaseNameItem.name
                    )
                    let item = {
                      name: sysDiseaseNameItem.name,
                      isSelect: !hasItem ? false : true,
                    }
                    newList.push(item)
                  }
                  diseaseNameList = newList
                }

                config.push({
                  name: detailItem.name,
                  type: detailItem.type,
                  description: '',
                  contents: sysItem.contents,
                  diseaseName: detailItem.diseaseName,
                  diseaseNameList: diseaseNameList,
                  diseaseNameNew: '',
                  isNormal: detailItem.isNormal,
                  extraAttributes: sysItem.extraAttributes,
                  position: sysItem.position,
                  merchantCode: detailItem.merchantCode,
                  id: detailItem.id,
                  dragUserId: detailItem.dragUserId,
                  customerId: detailItem.customerId,
                  createTime: detailItem.createTime,
                  province: detailItem.province,
                  city: detailItem.city,
                  area: detailItem.area,
                  guardianIdCard: detailItem.guardianIdCard
                    ? detailItem.guardianIdCard
                    : '',
                  guardianName: detailItem.guardianName
                    ? detailItem.guardianName
                    : '',
                  defaultUser: detailRes.defaultUser,
                })
              }
            })
          })
        } else {
          sysRes.forEach((sysItem) => {
            config.push({
              name: sysItem.name,
              type: sysItem.code,
              description: '',
              diseaseName: [],
              contents: sysItem.contents,
              diseaseNameList: sysItem.diseaseNameList,
              diseaseNameNew: '',
              isNormal: 0,
              extraAttributes: sysItem.extraAttributes,
              position: sysItem.position,
            })
          })
        }
        if (detailRes) {
          this.setData({
            id: detailRes.id,
            merchantCode: detailRes.merchantCode,
            createTime: detailRes.createTime,
            customerId: detailRes.customerId,
            name: detailRes.name,
            gender: detailRes.gender === 1 ? '1' : '0',
            age: detailRes.age,
            birthday: detailRes.birthday,
            verified: detailRes.verified,
            cardId: detailRes.cardId,
            mobile: detailRes.mobile,
            province: detailRes.province,
            city: detailRes.city,
            area: detailRes.area,
            guardianIdCard: detailRes.guardianIdCard,
            guardianName: detailRes.guardianName,
            defaultUser: detailRes.defaultUser,
          })
        }
        this.setData({ medicalHistoriesConfig: config })
        this.medicalHistoriesText()
        if (!this.data.province) {
          this.getRegionDataById(0)
        } else {
          this.getRegionDataById(1)
        }
      })
    })
  },
  //地区选择确定
  bindMultiPickerChange(e) {
    if (!e.detail.value[1]) {
      e.detail.value[1] = 0
    }
    if (!e.detail.value[2]) {
      e.detail.value[2] = 0
    }
    console.log('picker发送选择改变，携带值为', e)
    let { provinceDetailList, cityDetailList, areaDetailList } = this.data
    let areaValue =
      e.detail.value.length > 2 &&
      areaDetailList[e.detail.value[2]] &&
      areaDetailList[e.detail.value[2]].id
        ? areaDetailList[e.detail.value[2]].id
        : '暂无'
    this.setData({
      multiIndex: e.detail.value,
      province: provinceDetailList[e.detail.value[0]].id,
      city:
        cityDetailList[e.detail.value[1]] == '暂无'
          ? '暂无'
          : cityDetailList[e.detail.value[1]].id,
      area: cityDetailList[e.detail.value[1]] == '暂无' ? '暂无' : areaValue,
    })
    let { province, city, area } = this.data
    console.log('省市区', province, city, area)
  },
  //地区选择
  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    let regionList = []
    let citylist = []
    let areaList = []
    let cityDetail = []
    let areaDetail = []
    var data = {
      multiIndex: this.data.multiIndex,
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        let provinceId = this.data.provinceDetailList[e.detail.value].id
        this.getRegionList(provinceId).then((cityData) => {
          //无城市数据
          if (!cityData.length) {
            cityDetail.push('暂无')
          } else {
            let cityDataList = cityData
            cityDataList.forEach((cityItem) => {
              citylist.push(cityItem.name)
              cityDetail.push(cityItem)
            })
          }
          this.setData({
            cityDetailList: cityDetail,
          })
          if (cityDetail[0] == '暂无') {
            areaList.push('暂无')
            regionList[0] = this.data.multiArray[0]
            regionList[1] = cityDetail
            regionList[2] = areaList
            this.setData({
              multiArray: regionList,
            })
            return
          }
          let cityId = cityDetail[data.multiIndex[1]].id
          this.getRegionList(cityId).then((areaData) => {
            if (!areaData) {
              areaList.push('暂无')
            } else {
              let areaDataList = areaData
              areaDataList.forEach((areaItem) => {
                areaList.push(areaItem.name)
                areaDetail.push(areaItem)
              })
            }
            regionList[0] = this.data.multiArray[0]
            regionList[2] = areaList
            this.setData({
              multiArray: regionList,
              areaDetailList: areaDetail,
            })
          })
          // console.log('citylist', citylist);
          regionList[1] = citylist
        })
        break
      case 1:
        let cityId = this.data.cityDetailList[e.detail.value].id
        this.getRegionList(cityId).then((areaData) => {
          if (!areaData.length) {
            areaList.push('暂无')
          } else {
            let areaDataList = areaData
            areaDataList.forEach((areaItem) => {
              // console.log('areaItem', areaItem);
              areaList.push(areaItem.name)
              areaDetail.push(areaItem)
            })
          }
          regionList[0] = this.data.multiArray[0]
          regionList[1] = this.data.multiArray[1]
          regionList[2] = areaList
          this.setData({
            multiArray: regionList,
            areaDetailList: areaDetail,
          })
        })
        break
    }
    this.setData(data)
  },
  // 获取地区数据
  getRegionDataById(provinceId) {
    let regionList = []
    let provincelist = []
    let citylist = []
    let areaList = []
    let provinceDetail = []
    let cityDetail = []
    let areaDetail = []
    let self = this
    this.getRegionList(0).then((provinceData) => {
      //第一个省市区数据
      if (provinceId == 0) {
        provinceData.forEach((pronvinceItem) => {
          provincelist.push(pronvinceItem.name)
          provinceDetail.push(pronvinceItem)
          if (pronvinceItem.id == 110000) {
            this.getRegionList(pronvinceItem.id).then((cityData) => {
              cityData.forEach((cityItem) => {
                citylist.push(cityItem.name)
                cityDetail.push(cityItem)
                this.getRegionList(cityItem.id).then((areaData) => {
                  areaData.forEach((areaItem) => {
                    areaList.push(areaItem.name)
                    areaDetail.push(areaItem)
                  })
                  regionList[2] = areaList
                  self.setData({
                    multiArray: regionList,
                    provinceDetailList: provinceDetail,
                    cityDetailList: cityDetail,
                    areaDetailList: areaDetail,
                  })
                })
              })
              console.log('citylist', citylist)
              regionList[1] = citylist
            })
          }
        })
        console.log('provincelist', provincelist)
        regionList[0] = provincelist
      }
      //初始化省市区数据
      else {
        provinceData.forEach((pronvinceItem, index) => {
          let provinceIndex = index
          provincelist.push(pronvinceItem.name)
          provinceDetail.push(pronvinceItem)
          if (pronvinceItem.id == self.data.province) {
            this.getRegionList(pronvinceItem.id).then((cityData) => {
              let cityDataList = cityData
              if (!cityData.length) {
                citylist.push('暂无')
                cityDetail.push('暂无')
                areaList.push('暂无')
                areaDetail.push('暂无')
                regionList[1] = citylist
                regionList[2] = areaList
                self.setData({
                  multiArray: regionList,
                  provinceDetailList: provinceDetail,
                  cityDetailList: cityDetail,
                  areaDetailList: areaDetail,
                })
                self.setData({
                  multiIndex: [provinceIndex, 0, 0],
                })
                let a = {
                  detail: {
                    value: [provinceIndex, 0, 0],
                  },
                }
                self.bindMultiPickerChange(a)
              } else {
                cityDataList.forEach((cityItem, index) => {
                  let cityIndex = index
                  citylist.push(cityItem.name)
                  cityDetail.push(cityItem)
                  if (cityItem.id == self.data.city) {
                    this.getRegionList(cityItem.id).then((areaData) => {
                      if (areaData.length) {
                        areaData.forEach((areaItem, index) => {
                          let areaIndex = index
                          if (areaItem.id == self.data.area) {
                            self.setData({
                              multiIndex: [provinceIndex, cityIndex, areaIndex],
                            })
                          }
                          areaList.push(areaItem.name)
                          areaDetail.push(areaItem)
                        })
                        console.log('初始化areaList', areaList)
                        regionList[2] = areaList
                        self.setData({
                          multiArray: regionList,
                          provinceDetailList: provinceDetail,
                          cityDetailList: cityDetail,
                          areaDetailList: areaDetail,
                        })
                      } else {
                        areaList.push('暂无')
                        areaDetail.push('暂无')
                        regionList[1] = citylist
                        regionList[2] = areaList
                        self.setData({
                          multiArray: regionList,
                          provinceDetailList: provinceDetail,
                          cityDetailList: cityDetail,
                          areaDetailList: areaDetail,
                        })
                        self.setData({
                          multiIndex: [provinceIndex, cityIndex, 0],
                        })
                        let a = {
                          detail: {
                            value: [provinceIndex, cityIndex, 0],
                          },
                        }
                        self.bindMultiPickerChange(a)
                      }
                    })
                  }
                })
                console.log('初始化citylist', citylist)
                regionList[1] = citylist
              }
            })
          }
        })
        console.log('初始化provincelist', provincelist)
        regionList[0] = provincelist
      }
    })
  },
  getRegionList(id) {
    return new Promise((resolve) => {
      getRegionData(id, (data) => {
        resolve(data)
      })
    })
  },
  showMedicalHistoriesPopup() {
    console.log('showMedicalHistoriesPopup')
    this.setData({
      showMedicalHistories: true,
    })
  },
  hideMedicalHistoriesPopup() {
    console.log('showMedicalHistoriesPopup')
    this.setData({
      showMedicalHistories: false,
    })
  },
  // 疾病史-change radio event
  onMedicalNameChange(e) {
    let { type } = e.currentTarget.dataset
    let value = e.detail
    this.data.medicalHistoriesConfig.forEach((item, index) => {
      if (item.type === type) {
        this.setData({
          [`medicalHistoriesConfig[${index}].isNormal`]: value,
        })
      }
    })
    this.medicalHistoriesText()
  },
  // 疾病史-input blur
  onDiseaseNameNewBlur(e) {
    console.log('onDiseaseNameNewBlur', e)
    console.log('xxxxxxxxxxxblur')
    let { value } = e.detail
    let { type } = e.currentTarget.dataset
    this.data.medicalHistoriesConfig.forEach((item, index) => {
      if (item.type === type && value) {
        this.setData({
          [`medicalHistoriesConfig[${index}].diseaseNameNew`]: value,
        })
      }
    })
    this.medicalHistoriesText()
  },

  // 疾病史-input btn click
  onDiseaseNameNewClick(e) {
    console.log('xxxxxxxxxxxclick')
    console.log('onDiseaseNameNewClick', e)
    let { type } = e.currentTarget.dataset
    this.data.medicalHistoriesConfig.forEach((item, index) => {
      item.diseaseName = item.diseaseName ? item.diseaseName : []
      if (item.type === type && item.diseaseNameNew) {
        item.diseaseName.push(item.diseaseNameNew)
        item.diseaseNameList.push({
          name: item.diseaseNameNew,
          isSelect: true,
        })
        this.setData({
          [`medicalHistoriesConfig[${index}].diseaseName`]: item.diseaseName,
          [`medicalHistoriesConfig[${index}].diseaseNameList`]:
            item.diseaseNameList,
          [`medicalHistoriesConfig[${index}].diseaseNameNew`]: '',
        })
      }
    })
    this.medicalHistoriesText()
  },

  // 疾病史-input btn click
  onDiseaseItemClick(e) {
    console.log('onDiseaseItemClick', e)
    let { type, disease } = e.currentTarget.dataset
    this.data.medicalHistoriesConfig.forEach((item, index) => {
      if (item.type === type) {
        // item.diseaseName.push(item.diseaseNameNew)
        item.diseaseName = []
        item.diseaseNameList.forEach((cell) => {
          if (cell.name == disease.name) {
            cell.isSelect = !cell.isSelect
          } else if (type == 'BREASTFEEDING') {
            cell.isSelect = false
          }
        })
        item.diseaseNameList.forEach((cell) => {
          if (cell.isSelect) {
            item.diseaseName.push(cell.name)
          }
        })

        this.setData({
          [`medicalHistoriesConfig[${index}].diseaseName`]: item.diseaseName,
          [`medicalHistoriesConfig[${index}].diseaseNameList`]:
            item.diseaseNameList,
          [`medicalHistoriesConfig[${index}].diseaseNameNew`]: '',
        })
      }
    })
    this.medicalHistoriesText()
  },

  saveMedicalHistories() {
    if (!this.medicalHistoriesValidator()) return
    this.setData({
      showMedicalHistories: false,
    })
  },
  // 获取用药人信息里的疾病史配置
  handleDragUserSys() {
    return new Promise((resolve) => {
      getDragUserSYS((data) => {
        resolve(data)
      })
    })
  },

  // 获取用药人信息详情
  getdragUserDetailById() {
    return new Promise((resolve) => {
      if (this.data.currentDragUserId !== 'new') {
        getDragUserDetail(this.data.currentDragUserId, (data) => {
          resolve(data)
        })
      } else {
        resolve('')
      }
    })
  },

  userNameChange(e) {
    let name = e.detail.value
    this.setData({
      name: name,
    })
  },
  guardianNameChange(e) {
    let guardianName = e.detail.value
    this.setData({
      guardianName: guardianName,
    })
  },
  phoneChange(e) {
    let mobile = e.detail.value
    this.setData({
      mobile: mobile,
    })
  },
  onIDCardChange(e) {
    let reg = /[^0-9Xx]/g
    const newcid = e.detail.value.toLocaleUpperCase().replace(reg, '')
    let cardId = newcid.substring(0, 18)
    this.setData({ cardId: cardId })
    if (cardId.length == 18) {
      // 填写完毕之后，自动计算男女、年龄、出生日期
      let patientBirth = cardId.slice(6, 14)
      let birthday = patientBirth.replace(/(.{4})(.{2})/, '$1-$2-')
      let age = this.analyzeIDCard(cardId)
      this.setData({
        birthday: birthday,
        age: age,
      })
      if (parseInt(cardId.slice(-2, -1)) % 2 == 1) {
        // 男
        this.setData({
          gender: '1',
        })
      } else {
        // 女
        this.setData({
          gender: '0',
        })
      }
    }
  },
  onGuardianCardChange(e) {
    let reg = /[^0-9Xx]/g
    const newcid = e.detail.value.toLocaleUpperCase().replace(reg, '')
    let cardId = newcid.substring(0, 18)
    this.setData({ guardianIdCard: cardId })
  },
  analyzeIDCard(IDCard) {
    var age = 0,
      yearBirth,
      monthBirth,
      dayBirth
    //获取用户身份证号码
    var userCard = IDCard
    //如果身份证号码为undefind则返回空
    if (!userCard) {
      return age
    }
    var reg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/ //验证身份证号码的正则
    if (reg.test(userCard)) {
      if (userCard.length == 15) {
        var org_birthday = userCard.substring(6, 12)
        //获取出生年月日
        yearBirth = '19' + org_birthday.substring(0, 2)
        monthBirth = org_birthday.substring(2, 4)
        dayBirth = org_birthday.substring(4, 6)
      } else if (userCard.length == 18) {
        //获取出生年月日
        yearBirth = userCard.substring(6, 10)
        monthBirth = userCard.substring(10, 12)
        dayBirth = userCard.substring(12, 14)
      }
      //获取当前年月日并计算年龄
      var myDate = new Date()
      var monthNow = myDate.getMonth() + 1
      var dayNow = myDate.getDate()
      var age = myDate.getFullYear() - yearBirth
      if (
        monthNow < monthBirth ||
        (monthNow == monthBirth && dayNow < dayBirth)
      ) {
        age--
      }
      //返回年龄
      return age
    } else {
      return ''
    }
  },
  // 输出疾病史文案
  medicalHistoriesText() {
    let textArray = []
    this.data.medicalHistoriesConfig.forEach((item) => {
      let whetherText = ''
      if (item.type == 'LIVER_FUNCTION' || item.type == 'KIDNEY_FUNCTION') {
        let index = item.isNormal ? 0 : 1
        whetherText = item.extraAttributes[index].label
        textArray.push(`${item.name}${whetherText}`)
      } else {
        whetherText = item.isNormal ? '有' : '无'
        textArray.push(`${whetherText}${item.name}`)
      }
    })
    this.setData({
      medicalHistoriesText: textArray.join('、'),
    })
  },

  // 保存用药人信息
  saveDragUser() {
    let self = this
    if (!this.data.name) {
      wx.showToast({
        title: '请填写用药人姓名',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    if (!this.data.cardId) {
      wx.showToast({
        title: '请填写身份证号码',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    if (!isCardNo(this.data.cardId)) {
      wx.showToast({
        title: '请填写正确的身份证号码',
        icon: 'none',
        duration: 2000,
      })
      return false
    }

    if (!this.data.mobile) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    if (!isPhone(this.data.mobile)) {
      wx._showToast({ title: '请填写正确的手机号' })
      return
    }
    if (!this.data.province) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    if (!this.data.guardianName && this.data.age < 6) {
      wx.showToast({
        title: '请填写监护人姓名',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    if (this.data.age < 6 && !this.data.guardianIdCard) {
      wx.showToast({
        title: '请填写监护人身份证号码',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    if (this.data.age < 6 && !isCardNo(this.data.guardianIdCard)) {
      wx.showToast({
        title: '请填写正确的监护人身份证号码',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    let data = {
      name: self.data.name,
      gender: self.data.gender === '1' ? 1 : 0,
      age: self.data.age,
      birthday: self.data.birthday,
      cardId: self.data.cardId,
      mobile: self.data.mobile,
      verified:
        self.data.currentDragUserId !== 'new' ? self.data.verified : false,
      medicalHistories: self.data.medicalHistoriesConfig,
      province: self.data.province,
      city: self.data.city == '暂无' ? null : self.data.city,
      area: self.data.area == '暂无' ? null : self.data.area,
      guardianIdCard: self.data.guardianIdCard ? self.data.guardianIdCard : '',
      guardianName: self.data.guardianName ? self.data.guardianName : '',
      defaultUser: self.data.defaultUser,
    }
    if (self.data.currentDragUserId === 'new') {
      postDragUser(data, (res) => {
        console.info('saveDragUser', res)
        this.$to('', 'navigateBack')
      })
    } else {
      let putData = {
        ...data,
        id: self.data.id,
        merchantCode: self.data.merchantCode,
        createTime: self.data.createTime,
        customerId: self.data.customerId,
      }
      putDragUser(self.data.currentDragUserId, putData, (res) => {
        console.info('saveDragUser', res)
        this.$to('', 'navigateBack')
      })
    }
  },

  // 疾病历史验证器
  medicalHistoriesValidator() {
    const medicalHistories = this.data.medicalHistoriesConfig || []
    for (const mh of medicalHistories) {
      if (
        mh.isNormal == 1 &&
        !mh.diseaseName.length &&
        mh.type != 'LIVER_FUNCTION' &&
        mh.type != 'KIDNEY_FUNCTION'
      ) {
        wx._showToast({ title: `${mh.name}填写错误！` })
        return false
      }
    }
    return true
  },
  //获取现在渠道
  getCurrentChannnel() {
    let self = this
    um.getChannelASync().then((channel) => {
      self.setData({
        currentChannel: channel,
      })
    })
  },
})
