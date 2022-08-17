import { userListMock } from './_config'
import { getDragUserList, delDragUser,setDefaultDrugUser } from './_serivce'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import um from '../../manager/userInfo'


Page({
  /**
   * 页面渲染数据
   */
  data: {
    userList: [],
    currentChannel:""
  },

  /**
   * 生命周期函数
   */
  onShow() {
    this.getList()
    let self = this
    um.getChannelASync().then(channel=>{
      self.setData({
        currentChannel: channel
      })
    })
  },

  // 获取用药人列表
  getList() {
    getDragUserList(data => {
      console.info('getDragUserList', data)
      let list = []
      data.forEach(item => {
        //名字超过三个字就省略
        item.name= item.name.length > 3 ? item.name.slice(0, 3) + '...' : item.name
        list.push({
          ...item,
          noPassByMobile: item.mobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
        })
      })
      this.setData({
        userList: list
      })
    })
  },

  // 进入用药人详情页面
  goDragUserDetail(e) {
    console.info('goDragUserDetail', e)
    let { id } = e.currentTarget.dataset
    this.$to(`dragUserDetail/dragUserDetail?id=${id}`, 'navigate')
  },

  // 删除用药人
  deleteDragUser(e) {
    let { id } = e.currentTarget.dataset
    Dialog.confirm({
      title: '标题',
      message: '是否删除用药人？'
    })
      .then(() => {
        // on confirm
        console.info('del-confirm')
        delDragUser(id, data => {
          console.info('删除用药人', data)
          Dialog.alert({
            title: '提示',
            message: '删除成功'
          })
          this.getList()
        })
      })
      .catch(() => {
        // on cancel
      })
  },
  // 设置默认
  onChange (e) {
    const { item } = e.currentTarget.dataset
    setDefaultDrugUser(item.id, res => {
      this.getList()
    })
   },
  // 选择当前用药人并携带 id 返回上一页
  selectDragUser(e) {
    let { item } = e.currentTarget.dataset
    console.log("item",item);
    if(!item.province && this.data.currentChannel=='hkk'){
      wx._showToast({ title: '当前用药人信息未完善' })
      return
    }
    console.info('selectDragUser')
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    if (!prevPage) return

    prevPage.setData({
      selectedDragUserId: item.id
    })
    wx.navigateBack({
      delta: 1
    })
  }
})
