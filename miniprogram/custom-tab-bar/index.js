const app = getApp()

Component({
  data: {
    value: 'home',
    list: [
      { value: 'home', label: '汇报', icon: 'article' },
      { value: 'profile', label: '我的', icon: 'user' },
    ],
  },

  lifetimes: {
    ready() {
      const { role } = app.global.user
      if (role === 'admin') {
        this.setData({
          list: [
            { value: 'report', label: '汇报', icon: 'article' },
            // { value: 'stat', label: '统计', icon: 'assignment-checked' },
            { value: 'me', label: '我的', icon: 'user' },
          ]
        })
      }
    }
  },
  methods: {
    onChange(e) {
      const value = e.detail.value
      this.setData({ value })
      const { role } = app.global.user
      if (role === 'admin') {
        wx.switchTab({ url: `/pages/admin/${value}/index` })
      } else {
        wx.switchTab({ url: `/pages/${value}/index` })
      }
    },
  }
})