/**
 * 静态 CMS BLOCK
 */

import { getCurrentPage } from '../utils/util'

// 会员相关 BLOCK
const MEMBER_CMS_BLOCK = {
  registerBannerBlock: 'member-registration',
  subscribeBannerBlock: 'wechat-subscription'
}

const POPUP_CMS_BLOCK = {
  popupBlock: 'mp-popup'
}

// 页面静态 CMS
const PAGE_CMS_BLOCK = {
  'pages/home/home': {
    pageCode: 'homepage',
    blockCode: {
      ...POPUP_CMS_BLOCK,
      ...MEMBER_CMS_BLOCK
    }
  },

  'pages/center/center': {
    pageCode: 'seeding-center',
    blockCode: {
      ...POPUP_CMS_BLOCK
    }
  },

  'pages/cart/cart': {
    blockCode: {
      ...POPUP_CMS_BLOCK,
      promotionBannerBlockCode: 'cart-promo-banner',
      recommendationProductBlockCode: 'cart-product'
    }
  },

  'pages/profile/profile': {
    blockCode: {
      ...POPUP_CMS_BLOCK,
      ...MEMBER_CMS_BLOCK
    }
  },

  'pages/paySuccess/paySuccess': {
    blockCode: {
      ...POPUP_CMS_BLOCK,
      promotionBannerBlockCode: 'payment-promo-banner',
      recommendationProductBlockCode: 'payment-product'
    }
  },

  'pages/orderDetail/orderDetail': {
    blockCode: {
      ...POPUP_CMS_BLOCK,
      recommendationProductBlockCode: 'orderdetail-product'
    }
  },

  'pages/videoList/videoList': {
    pageCode: 'how-to-video-list',
    blockCode: {
      ...POPUP_CMS_BLOCK
    }
  },

  'pages/search/search': {
    blockCode: {
      ...POPUP_CMS_BLOCK,
      recommendationProductBlockCode: 'search-product'
    }
  },

  'pages/productDetail/productDetail': {
    blockCode: {
      ...POPUP_CMS_BLOCK,
      courtesyBlockCode: 'pdp-benefit'
    }
  }
}

export const getPageCmsContent = path => {
  path = path || getCurrentPage().route
  return PAGE_CMS_BLOCK[path]
}

export const getMemberCmsBlock = type => {
  return MEMBER_CMS_BLOCK[type]
}
