/**
 * 数据配置
 */

// tab 列表
export const tabList = [
  {
    label: '已领取',
    key: 'toBePresented'
  },
  {
    label: '已使用',
    key: 'exchanged'
  },
  {
    label: '已过期',
    key: 'expired'
  }
]

// tab映射
export const statusForTab = {
  toBePresented: 0,
  exchanged: 1,
  expired: 2
}