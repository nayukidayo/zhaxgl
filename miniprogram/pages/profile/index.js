const app = getApp()

Page({
  data: {
    name: '',
    phone: '',
    company: '',
    address: '',
    street: '',
  },

  onLogoutClick() {
    app.global.user = {}
    wx.clearStorageSync()
    wx.reLaunch({ url: '/pages/login/index' })
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ value: 'profile' })
    }
    const { name, phone, company, street } = app.global.user
    this.setData({
      name: name || '',
      phone: phone,
      company: company.name || '',
      address: company.address || '',
      street: street ? street[0].name : '',
    })
  },
})