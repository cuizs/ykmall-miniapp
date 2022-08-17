/**
 * 网络请求请求队列
 * 非实用性队列封装, 针对该网路请求进行特殊封装
 */

class Queue {
  constructor() {
    this.queue = []
  }

  // 获取队列
  get() {
    return this.queue
  }

  // 从队列中取出数据
  pop() {
    return this.queue.pop()
  }

  // 队列中是否存在该数据
  has(item) {
    if (!item) {
      console.warn('[removeByItem !item]请传入有效值: ', item)
      return false
    }

    const result = this.queue.find(queueItem => JSON.stringify(queueItem) == JSON.stringify(item))
    return !!result
  }

  // 向队列中添加数据
  push(item) {
    if (!item) {
      console.warn('[push]请传入有效值: ', item)
      return
    }
    this.queue.push(item)
  }

  // 删除全部数据
  removeAll() {
    this.queue = []
  }

  // 删除指定数据
  removeByItem(item) {
    if (!item) {
      console.warn('[removeByItem !item]请传入有效值: ', item)
      return
    }
    let index = null
    for (let i = 0; i < this.queue.length; i++) {
      const queueItem = this.queue[i]
      if (JSON.stringify(item) == JSON.stringify(queueItem)) {
        index = i
        break
      }
    }
    if (index === null) {
      return
    }
    this.queue.splice(index, 1)
  }
}

export default Queue
