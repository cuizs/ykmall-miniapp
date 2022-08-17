import { isPhone, isEmail } from '../utils/util'

/**
 * 验证器
 * @param { Object } value form表单数据
 * @param { Object } rules form表单验证规则
 * @description
 * - 通过传入的表单数据和验证规则进行判断验证，参考vue-validator。
 * - 验证的配置字段:
 *    range：范围（如：range: true, min: 3, max: 16）
 *    len：长度（如：len: 8）
 *    phone：正则电话（如：phone: true）
 *    email：正则邮箱（如：email: true）
 * - 返回两个结果：valid：验证通过则为true，失败为false。result：验证的具体结果。
 * rules = {
 *  name: {required: true, msg: '姓名不能为空', len: 8}
 * }
 */

export const validator = (objc = {}) => {
  if (!objc.formData && !objc.rules) return
  let validResults = _Utils.filterValue(objc.formData, objc.rules)
  let judgeResults = true
  let reasonText = ''
  for (const key in validResults) {
    judgeResults = judgeResults && !!validResults[key]['valid']
    if (!judgeResults) {
      reasonText = validResults[key]['msg']
      break
    }
  }
  objc.result && objc.result(judgeResults, validResults, reasonText)
}

const _Utils = {
  filterValue(formData, rules) {
    for (const key in formData) {
      // 规则中存在的字段
      if (rules[key]) {
        const value = formData[key]
        const rule = rules[key]
        rule['valid'] = this.checkValue(value, rule)
      }
    }
    return rules
  },

  // 根据规则进行检查
  checkValue(value, rule) {
    if (!rule.required) {
      return false
    }
    let results = []

    if (rule.required) {
      results.push(!!value)
    }
    if (rule.range) {
      const min = rule.min || 0
      const max = rule.max || Infinity
      const length = value ? value.length : 0
      results.push(length > min && length < max)
    }
    if (rule.len) {
      const length = value ? value.length : 0
      results.push(length === rule.len)
    }
    if (rule.phone) {
      results.push(isPhone(value))
    }
    if (rule.email) {
      results.push(isEmail(value))
    }
    let judge = !results.includes(false)
    return judge
  }
}
