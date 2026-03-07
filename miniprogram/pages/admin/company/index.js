const app = getApp()

Page({
  data: {
    search: '',
    street: {
      value: '',
      options: [],
    },
    records: [],
    isRefresh: false,
    isLower: false,
  },

  pageSize: 10,
  pageNumber: 1,
  hasNextPage: false,

  onAddClick() {
    wx.navigateTo({
      url: '/pages/admin/company/upsert/index',
    })
  },

  onRecordTap(e) {
    wx.navigateTo({
      url: '/pages/admin/company/upsert/index?id=' + e.mark.id,
    })
  },

  onSearch() {
    this.onRefresh()
  },

  onStreetChange(e) {
    this.setData({ 'street.value': e.detail.value })
    this.onRefresh()
  },

  async onRefresh() {
    this.setData({ isRefresh: true })
    await this.loadPageOne()
    this.setData({ isRefresh: false })
  },

  async onLower() {
    if (!this.hasNextPage) return
    this.pageNumber++
    this.setData({ isLower: true })
    const records = await this.loadPage()
    this.setData({
      isLower: false,
      records: this.data.records.concat(records),
    })
  },

  onLoad() {
    const { street } = app.global.user
    this.setData({
      street: {
        value: street[0].name,
        options: street.map(v => ({ value: v.name, label: v.name }))
      }
    })
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ value: 'company' })
    }
    this.onRefresh()
  },

  async loadPageOne() {
    this.pageNumber = 1
    const records = await this.loadPage()
    this.setData({ records })
  },

  async loadPage() {
    const { street, search } = this.data
    const $and = [{ street: { $eq: street.value } }]
    if (search.trim() !== '') {
      $and.push({ name: { $search: search } })
    }
    const { data } = await wx.cloud.models.companies.list({
      filter: { where: { $and } },
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      orderBy: [{ updatedAt: 'desc' }],
      select: { name: true, staffName: true, staffPhone: true, important: true, updatedAt: true }
    })
    this.hasNextPage = data.records.length === this.pageSize
    return data.records
  }
})