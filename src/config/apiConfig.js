/**
 * 网络配置
 */
import evnConfig from './evnConfig'

// 当前环境
const ENV = evnConfig.EVN

// 默认配置
const DEFAULT_CONFIG = {
  // 网络请求地址
  BASEURL: {
    dev: 'https://ykmalldev.ykyao.com/mall-backend',
    dev2: 'https://ykmalldev2.ykyao.com/mall-backend',
    test: 'https://tmall.ykyao.com/mall-backend',
    prod: 'https://mall.ykyao.com/mall-backend-prod',
  },

  // 图片请求地址
  BASEIMGURL: {
    dev: 'https://ykmalldev.ykyao.com/oss/images',
    dev2: 'https://ykmalldev2.ykyao.com/oss/images',
    test: 'https://tmall.ykyao.com/oss/images',
    prod: 'https://mall.ykyao.com/oss/images',
  },

  // 第三方请求地址
  THIRDURL: {
    dev: 'https://gktest.ykyao.net',
    test: 'https://gktest.ykyao.net',
    prod: 'https://saas.yiyunhp.com',
  },
  // 跳转会员中心appid
  MEMBERAPPID: {
    dev: 'wx710235a5582428cb',
    test: 'wx710235a5582428cb',
    prod: 'wx9a21c683c859e52c',
  },
  // 医云患者端小程序
  OTHER_MA: {
    dev: {
      appid: 'wxfc9fc9e3beaa1057',
      channel: {
        chunmiaoshop: '847830595995176960',
        ykyw: '847830595995176960',
        yunkai: '847830595995176960',
        rxga: '888027888245280768',
        gjk: '900739006570958848',
        xcm: '864446873295917056',
        hkk: '946436746365636608',
      },
    },
    dev2: {
      appid: 'wxfc9fc9e3beaa1057',
      channel: {
        chunmiaoshop: '847830595995176960',
        ykyw: '847830595995176960',
        yunkai: '847830595995176960',
        rxga: '888027888245280768',
        gjk: '900739006570958848',
        xcm: '864446873295917056',
        hkk: '946436746365636608',
      },
    },
    test: {
      appid: 'wxfc9fc9e3beaa1057',
      channel: {
        chunmiaoshop: '847830595995176960',
        ykyw: '847830595995176960',
        yunkai: '847830595995176960',
        rxga: '888027888245280768',
        gjk: '900739006570958848',
        xcm: '864446873295917056',
        hkk: '946436746365636608',
      },
    },
    prod: {
      appid: 'wx625195ee7ae0b8d4',
      channel: {
        chunmiaoshop: '847830726165401600',
        ykyw: '847830726165401600',
        yunkai: '847830726165401600',
        rxga: '888028353997574144',
        gjk: '904741405316878336',
        xcm: '864446315579314176',
        hkk: '946029518634618880',
      },
    },
  },
  // 数据上报地址
  TRACK_BASEURL: {
    dev: 'https://www.google-analytics.com',
    dev2: 'https://www.google-analytics.com',
    test: 'https://www.google-analytics.com',
    prod: 'https://www.google-analytics.com',
  },

  // CDN地址
  CDNURL: {
    dev: 'https://xybridge.cdn.dev.cn',
    dev2: 'https://xybridge.cdn.dev.cn',
    test: 'https://xybridge.cdn.dev.cn',
    prod: 'https://xybridge.cdn.prod.cn',
  },

  // 加密字符串
  APPSECRET: {
    dev: 'bWVtYmVyc2hpcDpwYXNz',
    dev2: 'bWVtYmVyc2hpcDpwYXNz',
    test: 'bWVtYmVyc2hpcDpwYXNz',
    prod: 'bWVtYmVyc2hpcDpwYXNz',
  },

  CUSTOM_SERVICE_ID: {
    dev: 'ww425735a3206b50c0',
    dev2: 'ww425735a3206b50c0',
    test: 'ww425735a3206b50c0',
    prod: 'ww425735a3206b50c0',
  },

  IM_WEBSOCKET_URL: {
    dev: 'wss://gktest.ykyao.net/tongxinrs/communicate',
    dev2: 'wss://gktest.ykyao.net/tongxinrs/communicate',
    test: 'wss://gktest.ykyao.net/tongxinrs/communicate',
    prod: 'wss://cdu.yiyunhp.com/tongxinrs/communicate',
  },
}

// 导出相关配置
export default {
  BASEURL: DEFAULT_CONFIG['BASEURL'][ENV],

  BASEIMGURL: DEFAULT_CONFIG['BASEIMGURL'][ENV],

  THIRDURL: DEFAULT_CONFIG['THIRDURL'][ENV],

  TRACK_BASEURL: DEFAULT_CONFIG['TRACK_BASEURL'][ENV],

  CDNURL: DEFAULT_CONFIG['CDNURL'][ENV],

  APPSECRET: DEFAULT_CONFIG['APPSECRET'][ENV],

  OTHER_MA: DEFAULT_CONFIG['OTHER_MA'][ENV],

  CUSTOM_SERVICE_ID: DEFAULT_CONFIG['CUSTOM_SERVICE_ID'][ENV],

  IM_WEBSOCKET_URL: DEFAULT_CONFIG['IM_WEBSOCKET_URL'][ENV],

  MEMBERAPPID: DEFAULT_CONFIG['MEMBERAPPID'][ENV],
}
