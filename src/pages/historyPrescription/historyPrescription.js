import um from '../../manager/userInfo'
import { addDemandList, prescriptionList } from './_serve'
import { showLoading, hideLoading}  from '../../utils/network/_handler/toast.handler'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

    /**
     * 生命周期函数
     */
  onLoad() {
    um.get(user => {
      // 'oT3hkwBp6iZLNsJ8XIH5hVlFNXoo'
      prescriptionList(user.mpUnionId, res => {
        if (res.code == 200) {
          this.setData({
            list:res.data.orderList || []
          })
        }
      })
    })
   },

  /**
   * 页面事件
   */
   onAddDemandListClick(e) {
     const { list } = e.currentTarget.dataset

     if (!list.length) {
      wx.$showToast({ title: '续方信息缺失！' })
      return
     }

     showLoading()
     const promiseList = []
     for (const item of list) {
       const params = this.buildDemandParams(item)
       promiseList.push(addDemandList(params))
     }
     Promise.all(promiseList).then(res => {
      hideLoading()
      this.$to('bill/bill', 'switchTab')
     })
   },

   /**
    * 数据处理
    */
   buildDemandParams(drug) {
     return {
      isGroup: 0,
      name: drug.drugName,
      skuName: drug.drugName,
      quantity: drug.drugCount,
      serialNumber: drug.drugCode,
      productName: drug.drugUniversalNme,
      specValueJson: {
        '规格': drug.drugStandard
      }
     }
   }

})
