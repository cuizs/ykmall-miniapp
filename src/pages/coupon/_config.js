/**
 * 数据配置
 */

// tab 列表
export const tabList = [
  {
    label: '已领取',
    key: 'exchanged',
    requireStatus: ['exchanged'],
  },
  {
    label: '已使用',
    key: 'redeemed',
    requireStatus: ['redeemed'],
  },
  {
    label: '已过期',
    key: 'expired',
    requireStatus: ['expired'],
  },
]
