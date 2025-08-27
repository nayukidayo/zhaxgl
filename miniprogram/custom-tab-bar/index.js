Component({
  data: {
    value: 'home',
    list: [
      { value: 'home', label: '汇报', icon: 'article' },
      { value: 'profile', label: '我的', icon: 'user' },
    ],
  },
  methods: {
    onChange(e) {
      const value = e.detail.value
      wx.switchTab({ url: `/pages/${value}/index` })
      this.setData({ value })
    },
  }
})