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
    try {
      wx.showLoading({ mask: true, title: '加载中' })
      const arr = await Promise.all([this.streetsFind(phone), this.companiesFind(phone)])
      if (arr[0]) {
        app.global.user = arr[0]
        wx.switchTab({ url: '/pages/admin/report/index' })
        return
      }
      app.global.user = arr[1]
      wx.switchTab({ url: '/pages/home/index' })
    } catch (err) {
      wx.showToast({ mask: true, icon: 'error', title: '服务器繁忙' })
      console.log(err)
    }
  },

  async streetsFind(phone) {
    const { data } = await wx.cloud.models.streets.list({
      filter: { where: { contactPhone: { $eq: phone } } },
      select: { name: true, contactName: true }
    })
    if (!data.records.length) return null
    return {
      phone,
      name: data.records[0].contactName,
      street: data.records,
      role: 'admin',
    }
  },

  async companiesFind(phone) {
    const { data } = await wx.cloud.models.companies.list({
      filter: { where: { staffPhone: { $eq: phone } } },
      select: { name: true, address: true, street: true, staffName: true }
    })
    if (!data.records.length) return null
    return {
      phone,
      name: data.records[0].staffName,
      company: data.records,
      role: 'staff',
    }
  },
})