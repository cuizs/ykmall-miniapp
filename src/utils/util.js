/**
 * 公共工具方法
 **/
/**
 * 对象深拷贝(简陋版)
 */
export const deepCopy = obj => {
  const objClone = Array.isArray(obj) ? [] : {}

  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 避免互相引用 造成死循环
        if (obj[key] === obj) {
          continue
        }

        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepCopy(obj[key])
        } else {
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}
// 防止跳转
let _timer
export const debounce = (fun, delay = 300, immediate = true) => {
  let args, context, timestamp, result
  let later = function () {
    let last = new Date().getTime() - timestamp
    if (last < delay && last >= 0) {
      _timer = setTimeout(later, delay - last)
    } else {
      _timer = null
      if (!immediate) {
        result = fun.apply(context, args)
        if (!_timer) context = args = null
      }
    }
  }
  return function () {
    context = this
    args = arguments
    timestamp = new Date().getTime()
    let callNow = immediate && !_timer
    if (!_timer) _timer = setTimeout(later, delay)
    if (callNow) {
      result = fun.apply(context, args)
      context = args = null
    }
    return result
  }
}

// 防止双击(函数节流)
let _throttleTimer
export const throttle = (fn, wait = 2000) => {
  if (!_throttleTimer) {
    _throttleTimer = setTimeout(() => {
      clearTimeout(_throttleTimer)
      _throttleTimer = null
    }, wait)
    fn && fn()
  }
}

// 大小排序
export const sort = (value, type) => {
  if (typeof value != 'object') return []
  if (typeof value == 'object') {
    const asce = (x, y) => {
      return y[type] - x[type]
    }
    return value.sort(asce)
  }
}

// 对象key值按字母排列
export const objKeySort = value => {
  if (!value) return {}
  let keys = Object.keys(value).sort()
  let objc = {}
  for (let key of keys) {
    objc[key] = value[key]
  }
  return objc
}

// 判断是否是Ipx系列
export const isIpx = () => {
  const model = wx.getSystemInfoSync().model
  const keywords = ['iPhone X', 'iPhone11', 'iPhone12', 'iPhone13', 'unknown']

  for (const keyword of keywords) {
    if (model.indexOf(keyword) > -1) return true
  }
  return false
}

// 判断是否是手机号（1开头的任意11位数字，防止号段更新不及时，导致用户无法下单）
export const isPhone = value => {
  return /(^1([23456789][0-9]|4[579]|66|7[01235678]|9[589])[0-9]{8})$/.test(value)
}

// 判断是否是邮箱
export const isEmail = value => {
  return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(
    value
  )
}

// 判断身份证号码
export const isCardNo = num => {
  num = num.toUpperCase() //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
  if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) {
    return false
  } //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 //下面分别分析出生日期和校验位
  var len, re
  len = num.length
  if (len == 15) {
    re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/)
    var arrSplit = num.match(re) //检查生日日期是否正确

    var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4])
    var bCorrectDay
    bCorrectDay =
      dtmBirth.getYear() == Number(arrSplit[2]) &&
      dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
      dtmBirth.getDate() == Number(arrSplit[4])
    if (!bCorrectDay) {
      return false
    } else {
      //将15位身份证转成18位
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2)
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2')
      var nTemp = 0,
        i
      num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6)
      for (i = 0; i < 17; i++) {
        nTemp += num.substr(i, 1) * arrInt[i]
      }
      num += arrCh[nTemp % 11]
      return true
    }
  }
  if (len == 18) {
    re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)
    var arrSplit = num.match(re) //检查生日日期是否正确

    var dtmBirth = new Date(arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4])
    var bCorrectDay
    bCorrectDay =
      dtmBirth.getFullYear() == Number(arrSplit[2]) &&
      dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
      dtmBirth.getDate() == Number(arrSplit[4])
    if (!bCorrectDay) {
      return false
    } else {
      //检验18位身份证的校验码是否正确。
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var valnum
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2)
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2')
      var nTemp = 0,
        i
      for (i = 0; i < 17; i++) {
        nTemp += num.substr(i, 1) * arrInt[i]
      }
      valnum = arrCh[nTemp % 11]
      if (valnum != num.substr(17, 1)) {
        return false
      }
      return true
    }
  }
  return false
}

// 版本比较
export const compareVersion = (v1, v2) => {
  v1 = v1.split('.')
  v2 = v2.split('.')
  let len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    let num1 = parseInt(v1[i])
    let num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}

// 当前页面对象
export const getCurrentPage = () => {
  let pageStack = getCurrentPages()
  let curRoute = pageStack[pageStack.length - 1]
  return curRoute
}

// 判断两个数组是否是包含关系
export const getContainOfArray = (arr1, arr2) => {
  if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) {
    return false
  }
  // 确定两个数组长度 大小关系
  const bArray = arr1.length > arr2.length ? arr1 : arr2
  const sArray = arr1.length > arr2.length ? arr2 : arr1
  // 存在相同值存放在 cArray 中，若 sArray.length === cArray.length 则存在包含关系
  const cArray = []
  for (const bItem of bArray) {
    for (const sItem of sArray) {
      if (bItem.toString() === sItem.toString()) {
        cArray.push(bItem)
      }
    }
  }
  return sArray.length === cArray.length
}

export const getDate = (type, dateTime = '') => {
  const date = dateTime ? new Date(availableTimeFormat(dateTime)) : new Date()
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const hou = date.getHours()
  const miu = date.getMinutes()
  const sec = date.getSeconds()
  if (type === 'time') {
    return `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d} ${hou > 9 ? hou : '0' + hou}:${miu > 9 ? miu : '0' + miu
      }:${sec > 9 ? sec : '0' + sec}`
  }
  if (type === 'date') {
    return `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`
  }
}

export const availableTimeFormat = value => {
  return value.replace(/\-/g, '/')
}

// 加法运算
export const add = (num1, num2) => {
  let exp_1, exp_2, nums
  try {
    exp_1 = num1.toString().split('.')[1].length
  } catch (e) {
    exp_1 = 0
  }
  try {
    exp_2 = num2.toString().split('.')[1].length
  } catch (e) {
    exp_2 = 0
  }
  nums = Math.max(exp_1, exp_2)
  return (num1 * Math.pow(10, nums) + num2 * Math.pow(10, nums)) / Math.pow(10, nums)
}

// 减法运算
export const numSub = (num1, num2) => {
  let baseNum, baseNum1, baseNum2
  let precision
  try {
    baseNum1 = num1.toString().split('.')[1].length
  } catch (e) {
    baseNum1 = 0
  }
  try {
    baseNum2 = num2.toString().split('.')[1].length
  } catch (e) {
    baseNum2 = 0
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
  precision = baseNum1 >= baseNum2 ? baseNum1 : baseNum2
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision)
}

// 乘法运算
export const mul = (num1, num2) => {
  let exp_1, exp_2, nums
  try {
    exp_1 = num1.toString().split('.')[1].length
  } catch (e) {
    exp_1 = 0
  }
  try {
    exp_2 = num2.toString().split('.')[1].length
  } catch (e) {
    exp_2 = 0
  }
  let num = (num1 * Math.pow(10, exp_1) * (num2 * Math.pow(10, exp_2))) / Math.pow(10, exp_1 + exp_2)
  return num.toFixed(2) * 10 / 10
}

// 除法运算
export const div = (num1, num2) => {
  let baseNum1 = 0,
    baseNum2 = 0
  let baseNum3, baseNum4
  try {
    baseNum1 = num1.toString().split('.')[1].length
  } catch (e) {
    baseNum1 = 0
  }
  try {
    baseNum2 = num2.toString().split('.')[1].length
  } catch (e) {
    baseNum2 = 0
  }
  baseNum3 = Number(num1.toString().replace('.', ''))
  baseNum4 = Number(num2.toString().replace('.', ''))
  return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1)
}

// 字符串全为空格
export const isAllSpace = (str) => {
  var re = new RegExp("^[ ]+$");
  return re.test(str)
}

function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 
* 时间戳转化为年 月 日 时 分 秒 
* number: 传入时间戳 
* format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
export function formatTime2Date (number, format = "Y-M-D h:m:s") {
  console.log('number', number)
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }

  console.log('format', format)
  return format;
}
