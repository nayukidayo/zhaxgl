const app = getApp()

Page({
  data: {
    show: false,
  },

  onOkTap() {
    wx.navigateTo({ url: '/pages/login/index' })
  },
  
  async onReady() {
    const phone = wx.getStorageSync('phone')
    if (!phone) return this.setData({ show: true })
    wx.showLoading({ mask: true, title: '加载中' })
    const { data } = await wx.cloud.models.users.get({
      filter: { where: { phone: { $eq: phone } } },
      select: { name: true, phone: true, role: true, street: { name: true, code: true }, company: { name: true, address: true } }
    })
    app.global.user = data
    if (data.role === 'admin') {
      wx.switchTab({ url: '/pages/admin/report/index' })
    } else {
      wx.switchTab({ url: '/pages/home/index' })
    }
  },
})