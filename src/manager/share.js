import um from './userInfo'
import cnm from './channel'
import api from '../api/index'

const DEFAULT_PATH = '/pages/home/home'
const shareManager = {
  getCommonShareParams(withUserId = false){
    let channel = um.getCurrentChannel()
    let channelInfo = cnm.getChannelInfos()
    return {
      channel: channel,
      defaultTitle: channelInfo.name,
    }
  },

  // 默认分享的页面为首页、标题为渠道名称
  userShare( params = { title: '', path: '',  query: {} }) {
    let shareParams = this.getCommonShareParams()
    const p = new Promise((resolve) => {
      this.getUserInfo().then(user=>{
        let referrer = user.id // 推荐人用户id
        let referrerDoctorId = user.doctorId ? user.doctorId : '' // 推荐人医生id
        let partnerReferrerId = user.partnerReferrerId ? user.partnerReferrerId : '' // 推广人id
        let title = params.title ? params.title : shareParams.defaultTitle // 分享标题
        let pagePath = params.path ? params.path : DEFAULT_PATH
        let queryStr = this.getShareQueryString(params.query)
        let sharePath = `${pagePath}?${queryStr}&channel=${shareParams.channel}&referrer=${referrer}&referrerDoctorId=${referrerDoctorId}&partnerReferrerId=${partnerReferrerId}`
        this.addShareRecord({
          customerId: referrer,
          referrer: referrerDoctorId,
          page: sharePath
        })
        resolve({
          title: title,
          path: sharePath
        })
      })
    })
    return {
      promise: p
    }
  },

  // 根据参数获取分享拼接在路径后的参数
  getShareQueryString(query) {
    console.log(query)
    let str = ''
    for (let key in query) {
      let value = query[key];
      value = encodeURIComponent(value)
      str = str + `${key}=${value}&`
    }
    return str
  },

  getUserInfo() {
    return new Promise((resolve) => {
      um.get((user) => {
        if (user.doctorId) { 
          resolve(user)
        } else { 
          um.refresh((newUser => {
            resolve(newUser)
          }))
        }
      })
    })
  },

  // 记录分享记录
  addShareRecord(params) {
    api.shareRecord({
      loading: false,
      data: params,
      success: res => {
      }
    })
  }
}

export default shareManager