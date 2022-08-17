/**
 * 数据配置
 */

// 排序类型
export const SORT_TYPE = value => {
  const sortType = {
    asc: 'asc', // 升序
    desc: 'desc' // 降序
  }
  const type = sortType[value]
  if (!type) {
    console.log(`invalid type: ${value}`)
    return null
  }
  return type
}

// 默认筛选列表
export const DEFALUT_LIST = [
  {
    key: 'all',
    label: '全部',
    type: 'radio'
  },
  {
    key: 'price',
    label: '价格',
    type: 'sort'
  },
  {
    key: 'new',
    label: '新品',
    type: 'sort'
  }
]
