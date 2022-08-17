/**
 * 静态数据
 */

// tab list
export const tabList = [
  {
    name: '全部',
    status: 'All'
  },
  {
    name: '待付款',
    status: 'ToBePaid'
  },
  {
    name: '待发货',
    status: 'Paid'
  },
  {
    name: '待收货',
    // status: 'Finished' // 该状态属于特殊状态，用于过滤列表
    status: 'Delivered'
  },
  {
    name: '售后',
    status: 'AfterSale'
  }
]
