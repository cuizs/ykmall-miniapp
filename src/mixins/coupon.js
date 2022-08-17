/**
 * 页面混合器
 */
import { mul } from '../utils/util'

export default {
  data: {},

  handleCouponUtil(coupon) {
    return handleCouponUtilFun(coupon)
  }
}

export const handleCouponUtilFun = coupon => {
  console.log("coupon===", coupon);
  let extAmountText = {}
  const couponType = coupon.type || coupon.couponType 
  if (couponType == 'CashVoucher') {
    extAmountText = { amount: coupon.amount, unit: '¥', desc: '立减券' }
  } else if (couponType == 'Full') {
    extAmountText = {
      amount: coupon.amount,
      unit: '¥',
      desc: `满${coupon.minAmount}可用`
    }
  } else if (couponType == 'Discount') {
    extAmountText = {
      amount: parseFloat(mul(10, coupon.discountRate)).toFixed(1),
      unit: '折',
      desc: '立减折扣券'
    }
  } else if (couponType == 'FullDiscount') {
    extAmountText = {
      amount: parseFloat(mul(10, coupon.discountRate)).toFixed(1),
      unit: '折',
      desc: `满${coupon.minAmount}可用`
    }
  }
  coupon['extAmountText'] = extAmountText
  return coupon
}
