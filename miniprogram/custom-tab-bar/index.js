const app = getApp()

Component({
  data: {
    value: 'home',
    list: [
      { value: 'home', label: '自查报告', icon: 'article' },
      { value: 'live', label: '视频报告', icon: 'video-camera-1' },
      { value: 'profile', label: '我的', icon: 'user' },
    ],
  },

  lifetimes: {
    ready() {
      const { role } = app.global.user
      if (role === 'admin') {
        this.setData({
          list: [
            { value: 'report', label: '自查报告', icon: 'article' },
            { value: 'company', label: '单位名册', icon: 'city-6' },
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