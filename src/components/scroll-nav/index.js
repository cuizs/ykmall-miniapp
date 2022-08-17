Component({
    externalClasses: ['sol-class'],
    properties: {
        tabs: {
            type: Array,
            value: []
        },
        current: {
            type: Number,
            value: '',
            observer(newVal) {
                // 监听当前index值，切换
                this.updated(newVal)
            }
        }
    },
    data: {
        activeIndex: 0,
        navScrollLeft: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 触发 点击事件
         */
        onClick(e) {
            const { index, pop } = e.currentTarget.dataset
            this.updated(index, pop)
        },
        /**
         * 切换
         */
        updated(index, pop) {
            var _this = this
            // 设置当前位置
            const query = wx.createSelectorQuery().in(this)
            query
                .selectAll('.label-item')
                .boundingClientRect(function(rect) {
                    let width = 0
                    for (let i = 0; i < index; i++) {
                        width += rect[i].width
                    }
                    //大于屏幕一半的宽度则滚动
                    let clientWidth = wx.getSystemInfoSync().windowWidth / 2

                    if (width > clientWidth) {
                        _this.setData({
                            navScrollLeft: width + rect[index].width + 20 - clientWidth
                        })
                    } else {
                        _this.setData({
                            navScrollLeft: 0
                        })
                    }
                })
                .exec()
            //设置当前样式
            this.setData({
                activeIndex: index
            })
            this.triggerEvent('change', { index: index })
        }
    }
})
