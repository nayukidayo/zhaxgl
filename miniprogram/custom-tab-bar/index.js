const app = getApp()

Component({
  data: {
    value: 'home',
    list: [
      { value: 'home', label: '汇报', icon: 'article' },
      { value: 'profile', label: '我的', icon: 'user' },
    ],
    listAdmin: [
      { value: 'report', label: '汇报', icon: 'article' },
      { value: 'stat', label: '统计', icon: 'assignment-checked' },
      { value: 'me', label: '我的', icon: 'user' },
    ],
  },
  lifetimes: {
    attached() {
      const { role } = app.global.user
      if (role === 'admin') {
        this.setData({ list: this.data.listAdmin })
      }
    }
  },
  methods: {
    onChange(e) {
      const value = e.detail.value
      wx.switchTab({ url: `/pages/${value}/index` })
      this.setData({ value })
    },
  }
})