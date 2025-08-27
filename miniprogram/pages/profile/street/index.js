const app = getApp()

Page({
  data: {
    street: {
      visible: false,
      label: ['东丽开发区'],
      value: ['dl'],
      options: [
        { label: '万新街（临空经济区）', value: 'wx' },
        { label: '张贵庄街', value: 'zgz' },
        { label: '华明街（华明高新区）', value: 'hm' },
        { label: '华新街', value: 'hx' },
        { label: '东丽开发区', value: 'dl' },
        { label: '丰年街', value: 'fn' },
        { label: '军粮城街', value: 'jlc' },
        { label: '金桥街', value: 'jq' },
        { label: '金钟街', value: 'jz' },
        { label: '东丽湖街', value: 'dlh' },
        { label: '无瑕街', value: 'wux' },
        { label: '新立街', value: 'xl' },
      ]
    },
    search: '',
    showSearch: false,
    records: [],
    record: {},
  },

  async onSearch() {
    if (this.data.search === '') {
      return this.setData({ records: [] })
    }
    wx.showLoading({ mask: true, title: '加载中' })
    const { data } = await wx.cloud.models.companies.list({
      filter: {
        relateWhere: {
          street: { where: { code: { $eq: this.data.street.value[0] } } }
        },
        where: {
          name: { $search: this.data.search }
        }
      },
      pageSize: 100,
      pageNumber: 1,
      select: { name: true, address: true, street: { name: true, code: true } }
    })
    this.setData({ records: data.records })
    wx.hideLoading()
  },

  onStreetClick() {
    this.setData({ 'street.visible': true })
  },

  onStreetChange(e) {
    this.setData({
      'street.visible': false,
      'street.label': e.detail.label,
      'street.value': e.detail.value,
      search: '',
      showSearch: false,
      records: [],
      record: {},
    })
  },

  toggleShowSearch() {
    this.setData({ showSearch: !this.data.showSearch })
  },

  onItemTap(e) {
    this.setData({
      showSearch: false,
      record: this.data.records[e.mark.index],
    })
  },

  async onSaveTap() {
    const record = this.data.record
    if (!record._id) {
      wx.showToast({ mask: true, icon: 'error', title: '请选择单位' })
      return
    }
    const { _id } = app.global.user
    await wx.cloud.models.users.update({
      filter: { where: { _id: { $eq: _id } } },
      data: {
        company: { _id: record._id },
        street: [{ _id: record.street._id }],
      }
    })
    app.global.user.company = record
    app.global.user.street = [record.street]
    wx.navigateBack()
  },
})