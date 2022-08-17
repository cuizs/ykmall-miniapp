/**
 * 网络请求处理
 */
import api from '../../api/index'

// 新建用药人信息
export const postDragUser = (data, cb) => {
  api.postDragUser({
    loading: true,
    data,
    success: res => {
      cb && cb(res.data)
    }
  })
}

// 更新用药人信息
export const putDragUser = (id, data, cb) => {
  api.putDragUser(id, {
    loading: true,
    data,
    success: res => {
      cb && cb(res.data)
    }
  })
}

// 获取用药人信息疾病史配置
export const getDragUserSYS = cb => {
  api.getDragUserSYS({
    loading: true,
    success: res => {
      const data = res.data || []
      for (const item of data) {
        // item['diseaseName'] = []
        item['diseaseNameList'] = []
        if (!item.contents.length) continue

        for (const content of item.contents) {
          // item['diseaseName'].push({ name: content, isSelect: false })
          item['diseaseNameList'].push({ name: content, isSelect: false })
        }
      }
      cb && cb(data)
    }
  })
}

// 获取用药人信息详情
export const getDragUserDetail = (id, cb) => {
  api.getDragUserDetail(id, {
    success: res => {
      cb && cb(res.data)
    }
  })
}

// 获取地区信息
export const getRegionData = (id, cb) => {
  api.getRegionList(id, {
    success: res => {
      cb && cb(res.data)
    }
  })
}

