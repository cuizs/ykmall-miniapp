export const trans = (date, lastTime = 0) => {
  console.log('进来了', date)
  // var timestamp = getTimestamp(date)
  var d = new Date(Number(date))
  var t = new Date()
  var objd = {
    'Y': d.getFullYear(),
    'm': parseInt(d.getMonth()) + 1,
    'd': parseInt(d.getDate()),
    'w': d.getDay(),
    'H': d.getHours(),
    'i': d.getMinutes(),
    's': d.getSeconds(),
  }
  //分钟小于10 加一个0
  if (d.getMinutes() < 10) {
    objd.i = '0' + objd.i
  }
  var objt = {
    'Y': t.getFullYear(),
    'm': parseInt(t.getMonth()) + 1,
    'd': parseInt(t.getDate()),
    'w': t.getDay(),
    'H': t.getHours(),
    'i': t.getMinutes(),
    's': t.getSeconds(),
  }

  var timeStr = ''
  var dayPerMonthAddTime = getDayPerMonth(objd.Y)
  var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  if (date - Number(lastTime) <= 600000) {
    timeStr = ''
  } else if (objd.Y == objt.Y && objd.m == objt.m && objd.d == objt.d) {
    //判断当天
    timeStr += objd.H + ':' + objd.i

  } else if ((objd.Y == objt.Y && objd.m == objt.m && objd.d == objt.d - 1) || (objd.Y == objt.Y && objt.m - objd.m == 1 && dayPerMonthAddTime[objd.m] == objd.d && objt.d == 1) || (objt.Y - objd.Y == 1 && objd.m == 12 && objd.d == 31 && objt.m == 1 && objt.d == 1)) {
    //判断昨天
    timeStr += '昨天 ' + objd.H + ':' + objd.i + ' '
  } else if ((objd.Y == objt.Y && objd.m == objt.m && objt.d - objd.d < 7) || (objd.Y == objt.Y && objt.m - objd.m == 1 && dayPerMonthAddTime[objd.m] - objd.d + objt.d < 7 || (objt.Y - objd.Y == 1 && objd.m == 12 && objt.m == 1 && 31 - objd.d + objt.d < 7))) {
    //判断为七天内显示为周几
    timeStr += week[objd.w] + ' ' + objd.H + ':' + objd.i
  } else {
    //直接展示年月日
    timeStr += objd.Y + '年' + objd.m + '月' + objd.d + '日 ' + objd.H + ':' + objd.i
  }

  // 判断上下午，不要可以注释掉
  // if(objd.H < 13) {
  //   timeStr += ' 上午'
  // } else {
  //   timeStr += ' 下午'
  // }
  return timeStr
}

// function getTimestamp(date) {
//   return Date.parse(new Date(date))
// }
//月份
function getDayPerMonth (year) {
  var arr = []
  arr[1] = 31
  arr[3] = 31
  arr[4] = 30
  arr[5] = 31
  arr[6] = 30
  arr[7] = 31
  arr[8] = 31
  arr[9] = 30
  arr[10] = 31
  arr[11] = 30
  arr[12] = 31

  //闰年
  if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
    arr[2] = 29
  } else {
    arr[2] = 28
  }
  return arr
}


