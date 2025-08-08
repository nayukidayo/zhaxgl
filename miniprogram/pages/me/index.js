Page({
  data: {
    key: '',
    value: '',
  },

  onLoad() {
    this.getOpenerEventChannel().on('opener', data => {
      wx.setNavigationBarTitle({ title: data.title })
      this.setData(data)
    })
  },

  onSave() {
    const { key, value } = this.data
    if (key === 'name' || key === 'phone' || key === 'org_name') {
      if (value.trim() === '') {
        return wx.showToast({
          mask: true,
          icon: 'error',
          title: '内容不能为空',
        })
      }
    }
    this.getOpenerEventChannel().emit('opened', this.data)
    wx.navigateBack()
  },
})