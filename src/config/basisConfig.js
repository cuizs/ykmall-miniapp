// 已存在的渠道列表数据
export const EXIST_CHANNEL_LIST = [
  'yunkai',
  'chunmiaoshop',
  'ykyw',
  'rxga',
  'gjk',
  'xcm',
  'hkk',
  'ykneigou',
  'youanmen',
  'yytm',
  'pinksd',
]

/**
 * 项目基础配置
 **/
export const DEFAULT_CHANNEL = 'ykyw'
/**
 *  注意，这里添加对应的渠道配置之后
 *  还需要再style/theme 下配置对应的渠道主题配置
 *  还需要config/apiConfig 下配置对应的渠道跳转互联网医院渠道信息
 *  还需要在上方 EXIST_CHANNEL_LIST 下配置一下当前程序已支持XX渠道
 */
let exportConfig = {
  yunkai: {
    name: '春苗商城', // 项目名称，导航栏标题----春苗商城
    MERCHANT_CODE: 'yunkai',
    mainColor: '#8CC051',
    customerServiceUrl: 'https://work.weixin.qq.com/kfid/kfc1badba48073b7e28',
  },
  chunmiaoshop: {
    name: '春苗商城', // 项目名称，导航栏标题----春苗商城
    MERCHANT_CODE: 'chunmiaoshop',
    mainColor: '#8CC051',
    customerServiceUrl: 'https://work.weixin.qq.com/kfid/kfc1badba48073b7e28',
  },
  ykyw: {
    name: '云开药网', // 项目名称，导航栏标题----云开私域
    MERCHANT_CODE: 'ykyw',
    mainColor: '#6C88F0',
    customerServiceUrl: 'https://work.weixin.qq.com/kfid/kfcbc33f89785ad5208',
  },
  rxga: {
    name: '乳腺关爱中心', // 项目名称，导航栏标题----乳腺关爱中心
    MERCHANT_CODE: 'rxga',
    mainColor: '#D18FC8',
    customerServiceUrl: 'https://work.weixin.qq.com/kfid/kfc5f5349cfdf7e687a',
  },
  gjk: {
    name: '骨健康关爱中心', // 项目名称，导航栏标题----骨健康关爱中心
    MERCHANT_CODE: 'gjk',
    mainColor: '#b5dbf0',
    customerServiceUrl: 'https://work.weixin.qq.com/kfid/kfc22b786cb89916720',
  },
  xcm: {
    name: '小春苗关爱中心', // 项目名称，导航栏标题----小春苗关爱中心
    MERCHANT_CODE: 'xcm',
    mainColor: '#99CD54',
    customerServiceUrl: 'https://work.weixin.qq.com/kfid/kfc770224341e19f8fb',
  },
  hkk: {
    name: '合康康', // 项目名称，导航栏标题----合康康
    MERCHANT_CODE: 'hkk',
    mainColor: '#3C1CB2',
    customerServiceUrl: 'https://work.weixin.qq.com/kfid/kfc056d7890be54c0b4',
  },
  ykneigou: {
    name: '健康企业内购', // 项目名称，导航栏标题----健康企业内购
    MERCHANT_CODE: 'ykneigou',
    mainColor: '#b43a7a',
    customerServiceUrl: 'https://work.weixin.qq.com/kfid/kfc840b264497b8bae9',
  },
  youanmen: {
    name: '北京丰台右安门医院', // 项目名称，导航栏标题---北京丰台右安门医院
    MERCHANT_CODE: 'youanmen',
    mainColor: '#368efa',
    customerServiceUrl: 'https://work.weixin.qq.com/kfid/kfc7bd9bacf448868bb',
  },
  yytm: {
    name: '营养童盟育儿中心', // 项目名称，导航栏标题---营养童盟育儿中心
    MERCHANT_CODE: 'yytm',
    mainColor: '#99cd54',
    customerServiceUrl: 'https://work.weixin.qq.com/kfid/kfc97bfa054f3e01788',
  },
  pinksd: {
    name: '粉红丝带爱心商城', // 项目名称，导航栏标题---粉红丝带爱心商城
    MERCHANT_CODE: 'pinksd',
    mainColor: '#eb1d71',
    customerServiceUrl: 'https://work.weixin.qq.com/kfid/kfcfb1c14d3a797a9f1',
  },
}
export default exportConfig
