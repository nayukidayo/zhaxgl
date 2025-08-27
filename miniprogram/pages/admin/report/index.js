import { getMaxDate } from '../../../utils/utils'

const app = getApp()
const max = getMaxDate()

Page({
  data: {
    search: '',
    approve: {
      value: 'tbd',
      options: [
        { value: 'all', label: '全部状态' },
        { value: 'tbd', label: '等待审核' },
        { value: 'ok', label: '审核通过' },
        { value: 'ng', label: '审核驳回' },
      ],
    },
    start: {
      visible: false,
      value: max,
      start: '2025-01',
      end: '',
    },
    end: {
      visible: false,
      value: max,
      start: '',
      end: max,
    },
    records: [],
    isRefresh: false,
    isLower: false,
  },

  pageSize: 10,
  pageNumber: 1,
  nomore: false,

  onSearch() {
    this.onRefresh()
  },

  onApproveChange(e) {
    this.setData({
      'approve.value': e.detail.value
    }, () => this.onRefresh())
  },

  onStartTap() {
    this.setData({
      'start.visible': true,
      'start.end': this.data.end.value,
    })
  },

  onEndTap() {
    this.setData({
      'end.visible': true,
      'end.start': this.data.start.value,
    })
  },

  onStartChange(e) {
    this.setData({
      'start.visible': false,
      'start.value': e.detail.value,
    }, () => this.onSearch())
  },

  onEndChange(e) {
    this.setData({
      'end.visible': false,
      'end.value': e.detail.value,
    }, () => this.onSearch())
  },

  async onRefresh() {
    this.setData({ isRefresh: true })
    await this.loadPageOne()
    this.setData({ isRefresh: false })
  },

  async onLower() {
    if (this.nomore || this.data.records.length < this.pageSize) return
    this.pageNumber++
    this.setData({ isLower: true })
    const records = await this.loadPage()
    this.nomore = records.length < this.pageSize
    this.setData({
      records: this.data.records.concat(records),
      isLower: false,
    })
  },

  onRecordTap(e) {
    wx.navigateTo({ url: '/pages/report/index?report=' + e.mark.id })
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ value: 'report' })
    }
    this.onRefresh()
  },

  async loadPageOne() {
    this.nomore = false
    this.pageNumber = 1
    const records = await this.loadPage()
    this.setData({ records })
  },

  async loadPage() {
    const start = new Date(this.data.start.value).getTime()
    const date = new Date(this.data.end.value)
    date.setMonth(date.getMonth() + 1)
    const end = date.getTime()
    const and = [
      { publish: { $eq: true } },
      { publishedAt: { $gte: start } },
      { publishedAt: { $lt: end } },
    ]
    const approve = this.data.approve.value
    if (approve !== 'all') {
      and.push({ approve: { $eq: approve } })
    }
    const relateWhere = {}
    const serach = this.data.search.trim()
    if (serach) {
      relateWhere.company = { where: { name: { $search: serach } } }
    }
    const { data } = await wx.cloud.models.reports.list({
      filter: { relateWhere, where: { $and: and } },
      orderBy: [{ publishedAt: 'desc' }],
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      select: { approve: true, publishedAt: true, company: { name: true } }
    })
    return data.records
  },

})