
//问诊状态栏
export const stepsList = [
  {
    text: '填写信息',//0
    color: '#206FFF',
  },
  {
    text: '预约支付',//1
    color: '#206FFF',
    describe: '预约支付后将为您匹配医生进行问诊开方，如用药人不符合用药条件，订单将为您全额退款。',
  },
  {
    text: '取消订单',//2
    color: '#FF0000',
    describe: '您已将订单取消，如需购买点击再次购买，预约支付后将为您匹配医生进行问诊开方。'
  },
  {
    text: '医生开方',//3
    color: '#206FFF',
    describe: '根据国家规定，处方药需凭处方购买，您的医生正在与您进行问诊，如符合用药条件将为您开具处方。',
    doctor: '专业医师',
    buttonText: '查看问诊'
  },
  {
    text: '开方失败',//4
    color: '#FF0000',
    describe: '疑似您的病症不符合当前用药或长时间未回复导致问诊结束，处方未开具成功，如需购药请重新下单提交问诊。',
    doctor: '专业医师',
    // buttonText: '重新问诊'
  },
  {
    text: '药师审方',//5
    color: '#206FFF',
    describe: '为保障用药人的用药安全，专业药师正在审核您的处方，审核通过后系统将尽快安排发货。',
    doctor: '审方药师'
  },
  {
    text: '审方驳回',//6
    color: '#FF0000',
    describe: '为保障用药人的用药安全，专业药师已驳回处方，您可向客服咨询具体原因并重新下单提交问诊。',
    doctor: '审方药师',
    buttonText: '联系客服'
  },
  {
    text: '订单发货',//7
    color: '#206FFF',
  },
  {
    text: '已退款',//8
    color: '#FF0000',
  },
]