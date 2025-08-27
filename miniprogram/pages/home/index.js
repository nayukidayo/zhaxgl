const app = getApp()
const date = new Date()
date.setTime(date.getTime() + 8 * 60 * 60 * 1000)
const max = date.toISOString().slice(0, 7)

Page({
  data: {
    date: {
      visible: false,
      value: max,
      start: '2025-01',
      end: max,
    },
    records: [],
  },

  onDateClick() {
    this.setData({ 'date.visible': true })
  },

  onDateChange(e) {
    this.setData({
      'date.visible': false,
      'date.value': e.detail.value,
    }, () => this.serach())
  },

  async onAddClick() {
    const { _id, company } = app.global.user
    if (!company._id) {
      const res = await wx.showModal({ title: '请先完善个人资料' })
      if (res.confirm) {
        wx.switchTab({ url: '/pages/profile/index' })
      }
      return
    }
    wx.showLoading({ mask: true, title: '加载中' })
    const { data } = await wx.cloud.models.reports.create({
      data: { author: { _id }, company: { _id: company._id } }
    })
    wx.navigateTo({ url: '/pages/report/index?report=' + data.id })
  },

  onEdit(e) {
    const report = this.data.records[e.mark.index]._id
    wx.navigateTo({ url: '/pages/report/index?report=' + report })
  },

  async onDelete(e) {
    const { index } = e.mark
    const { records } = this.data
    const res = await wx.showModal({ title: '确认删除' })
    if (!res.confirm) return
    await wx.cloud.models.reports.delete({
      filter: { where: { _id: { $eq: records[index]._id } } }
    })
    records.splice(index, 1)
    this.setData({ records })
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ value: 'home' })
    }
    this.serach()
  },

  async serach() {
    wx.showLoading({ mask: true, title: '加载中' })
    const date = new Date(this.data.date.value)
    const start = date.getTime()
    date.setMonth(date.getMonth() + 1)
    const end = date.getTime()
    const { _id } = app.global.user
    const { data } = await wx.cloud.models.reports.list({
      filter: {
        where: {
          $and: [
            { author: { $eq: _id } },
            { createdAt: { $gte: start } },
            { createdAt: { $lt: end } },
          ]
        }
      },
      select: { publish: true, approve: true, createdAt: true }
    })
    this.setData({ records: data.records })
    wx.hideLoading()
  },
})