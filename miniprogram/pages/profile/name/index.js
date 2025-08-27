const app = getApp()

Page({
  data: {
    name: ''
  },

  async onSaveTap() {
    const { name } = this.data
    const { _id } = app.global.user
    await wx.cloud.models.users.update({
      filter: { where: { _id: { $eq: _id } } },
      data: { name }
    })
    app.global.user.name = name
    wx.navigateBack()
  },

  onReady() {
    this.setData({ name: app.global.user.name })
  },
})