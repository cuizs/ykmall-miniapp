/**
 * 处方信息填写模块
 */
import fetch from '../../utils/network/index'

// 新增用药人信息
const postDragUser = (objc = {}) => {
  fetch.post('/mp/api/v1/drag-user', objc)
}

// 获取用药人列表
const getDragUserList = (objc = {}) => {
  fetch.get('/mp/api/v1/drag-user', objc)
}

// 获取用药人信息详情
const getDragUserDetail = (id, objc = {}) => {
  fetch.get(`/mp/api/v1/drag-user/${id}`, objc)
}

// 更新用药人信息
const putDragUser = (id, objc = {}) => {
  fetch.put(`/mp/api/v1/drag-user/${id}`, objc)
}

// 删除用药人信息
const delDragUser = (id, objc = {}) => {
  fetch.delete(`/mp/api/v1/drag-user/${id}`, objc)
}

// 设置默认用药人
const setDefaultDrugUser = (id, objc = {}) => {
  fetch.get(`/mp/api/v1/drag-user/default/${id}`, objc)
}

// 处方信息填写
const postPrescription = (objc = {}) => {
  fetch.post(`/mp/api/v1/prescription`, objc)
}

// 更新处方信息
const putPrescription = (id, objc = {}) => {
  fetch.put(`/mp/api/v1/prescription/${id}`, objc)
}

// 删除处方信息
const delPrescription = (id, objc = {}) => {
  fetch.delete(`/mp/api/v1/prescription/${id}`, objc)
}

// 获取用药人疾病史配置
const getDragUserSYS = (objc = {}) => {
  fetch.get('/mp/api/v1/sys?type=MEDICAL_HISTORY', objc)
}

export default {
  postDragUser,
  getDragUserList,
  getDragUserDetail,
  putDragUser,
  delDragUser,
  postPrescription,
  putPrescription,
  delPrescription,
  getDragUserSYS,
  setDefaultDrugUser
}
