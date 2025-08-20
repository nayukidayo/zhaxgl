const app = getApp()

Page({
  data: {
    records: [],
    isRefresh: false,
    isLower: false,
    showAdd: app.global.user.role !== 'admin',
    showAddDialog: false,
  },

  pageSize: 10,
  pageNumber: 1,
  nomore: false,

  // async onReady() {
  //   wx.showLoading({ mask: true, title: '加载中' })
  //   const { _id, role, street } = app.global.user
  //   const { data } = await wx.cloud.models.report.list({
  //     filter: { where: role === 'admin' ? { street: { $in: street } } : { author: { $eq: _id } } },
  //     orderBy: [{ updatedAt: "desc" }],
  //     pageSize: this.pageSize,
  //     pageNumber: this.pageNumber,
  //     select: { $master: true, author: { name: true }, approver: { name: true } },
  //   })
  //   this.setData({ records: data.records })
  //   wx.hideLoading()
  // },

  async loadPageOne() {
    this.nomore = false
    this.pageNumber = 1
    const { _id, role, street } = app.global.user
    const { data } = await wx.cloud.models.report.list({
      filter: { where: role === 'admin' ? { street: { $in: street } } : { author: { $eq: _id } } },
      orderBy: [{ updatedAt: "desc" }],
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      select: { $master: true, author: { name: true }, approver: { name: true } },
    })
    this.setData({ records: data.records })
  },

  async onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar(tabBar => {
        tabBar.setData({ value: 'index' })
      })
    }
    wx.showLoading({ mask: true, title: '加载中' })
    await this.loadPageOne()
    wx.hideLoading()
  },

  async onRefresh() {
    this.setData({ isRefresh: true })
    await this.loadPageOne()
    this.setData({ isRefresh: false })
  },

  async onLower() {
    if (this.nomore) return
    this.pageNumber++
    this.setData({ isLower: true })
    const { _id, role, street } = app.global.user
    const { data } = await wx.cloud.models.report.list({
      filter: { where: role === 'admin' ? { street: { $in: street } } : { author: { $eq: _id } } },
      orderBy: [{ updatedAt: "desc" }],
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      select: { $master: true, author: { name: true }, approver: { name: true } },
    })
    this.nomore = data.records.length < this.pageSize
    this.setData({
      records: this.data.records.concat(data.records),
      isLower: false,
    })
  },

  onAddClick() {
    const user = app.global.user
    if (user.name && user.phone && user.org_name && user.org_street) {
      wx.navigateTo({ url: '/pages/report/index' })
      return
    }
    this.setData({ showAddDialog: true })
  },

  confirmAddDialog() {
    this.cancelAddDialog()
    wx.switchTab({ url: '/pages/profile/index' })
  },

  cancelAddDialog() {
    this.setData({ showAddDialog: false })
  },

  async onRecordTap(e) {
    const index = e.currentTarget.dataset.index
    const res = await wx.navigateTo({
      url: '/pages/review/index',
    })
    res.eventChannel.emit('opener', this.data.records[index])
  },

})