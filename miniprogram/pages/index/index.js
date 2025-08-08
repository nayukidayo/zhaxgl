const { getUserId } = require('../../utils/utils')

Page({
  data: {
    records: [],
    isRefresh: false,
    isLower: false,
    showAddDialog: false,
  },

  pageSize: 10,
  pageNumber: 1,
  nomore: false,

  async onReady() {
    wx.showLoading({ mask: true, title: '加载中' })
    const userId = await getUserId()
    const { data } = await wx.cloud.models.report.list({
      filter: { where: { user: { $eq: userId } } },
      orderBy: [{ updatedAt: "desc" }],
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      select: { $master: true, user: { name: true }, approver: { name: true } },
    })
    this.setData({ records: data.records })
    wx.hideLoading()
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar(tabBar => {
        tabBar.setData({ value: 'index' })
      })
    }
  },

  async onRefresh() {
    this.nomore = false
    this.pageNumber = 1
    this.setData({ isRefresh: true })
    const userId = await getUserId()
    const { data } = await wx.cloud.models.report.list({
      filter: { where: { user: { $eq: userId } } },
      orderBy: [{ updatedAt: "desc" }],
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      select: { $master: true, user: { name: true }, approver: { name: true } },
    })
    this.setData({
      records: data.records,
      isRefresh: false,
    })
  },

  async onLower() {
    if (this.nomore) return
    this.pageNumber++
    this.setData({ isLower: true })
    const userId = await getUserId()
    const { data } = await wx.cloud.models.report.list({
      filter: { where: { user: { $eq: userId } } },
      orderBy: [{ updatedAt: "desc" }],
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      select: { $master: true, user: { name: true }, approver: { name: true } },
    })
    this.nomore = data.records.length < this.pageSize
    this.setData({
      records: this.data.records.concat(data.records),
      isLower: false,
    })
  },

  onAddClick() {
    const profile = wx.getStorageSync('profile')
    if (
      typeof profile === 'object' && profile.name &&
      profile.phone && profile.org_name
    ) {
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