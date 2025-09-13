const app = getApp()

Page({
  data: {
    staffName: '',
    staffPhone: '',
    company: '',
    address: '',
    street: {
      value: '',
      options: [],
    },
    autosize: {
      maxHeight: 120,
      minHeight: 20,
    },
  },

  onChange(e) {
    this.setData({ [e.mark.key]: e.detail.value })
  },

  onStreetChange(e) {
    this.setData({ 'street.value': e.detail.value })
  },

  async onSaveTap() {
    const { company, address, staffName, staffPhone, street } = this.data
    if (!company || !staffName || !staffPhone) {
      wx.showToast({ mask: true, icon: 'error', title: '填写必填项' })
      return
    }
    try {
      wx.showLoading({ mask: true, title: '保存中' })
      const data = {
        name: company,
        street: street.value,
        address, staffName, staffPhone
      }
      if (this.companyId) {
        await wx.cloud.models.companies.update({
          filter: { where: { _id: { $eq: this.companyId } } },
          data
        })
      } else {
        await wx.cloud.models.companies.create({ data })
      }
      wx.hideLoading()
      wx.navigateBack()
    } catch (err) {
      console.log(err)
      wx.showToast({ mask: true, icon: 'error', title: '保存失败' })
    }
  },

  async onLoad({ id }) {
    this.companyId = id
    const { street } = app.global.user
    if (!id) {
      wx.setNavigationBarTitle({ title: '添加单位' })
      this.setData({
        street: {
          value: street[0].name,
          options: street.map(v => ({ value: v.name, label: v.name }))
        }
      })
      return
    }
    wx.setNavigationBarTitle({ title: '修改单位' })
    const { data } = await wx.cloud.models.companies.get({
      filter: { where: { _id: { $eq: id } } }
    })
    this.setData({
      staffName: data.staffName,
      staffPhone: data.staffPhone,
      company: data.name,
      address: data.address,
      street: {
        value: data.street,
        options: street.map(v => ({ value: v.name, label: v.name }))
      }
    })
  },
})