Component({
  relations: {
    '../tab/index': {
      type: 'child',
      linked() {
        this._updateCHange()
      }
    }
  },
  properties: {
    current: {
      type: String,
      value: 0,
      observer: '_updateCHange'
    },
    color: {
      type: String,
      value: '#367fa9'
    },
    scroll: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    _changeTab(index) {
      this.triggerEvent('onChange', { indexKey: index })
      this.data.current = index
      this._updateCHange()
    },
    _updateCHange() {
      const { current, color } = this.data
      const nodes = this.getRelationNodes('../tab/index') || []
      nodes.forEach(node => {
        node._updateChange(current, color)
      })
    }
  }
})
