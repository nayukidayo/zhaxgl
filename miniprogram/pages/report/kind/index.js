import kinds from '../../../utils/kinds'

Page({
  data: {
    mediaType: ['image'],
    max: 5,
    gridConfig: {
      column: 5,
      width: 120,
      height: 120,
    },
    sizeLimit: {
      size: 5,
      unit: 'MB',
      message: '图片大小不超过 5 MB'
    },
    config: {
      count: 1,
    },
    publish: false,
    payload: null,
  },

  onSuccess(e) {
    this.setData({ [`payload.things[${e.mark.index}].images`]: e.detail.files })
  },

  onRemove(e) {
    const images = this.data.payload.things[e.mark.index].images;
    images.splice(e.detail.index, 1);
    this.setData({ [`payload.things[${e.mark.index}].images`]: images });
  },

  onCheckChange(e) {
    this.setData({ 'payload.check': e.detail.value })
  },

  onCheckMsgChange(e) {
    this.setData({ 'payload.checkMsg': e.detail.value })
  },

  async onSaveTap() {
    try {
      wx.showLoading({ mask: true, title: '保存中' })
      const { payload } = this.data
      const result = await Promise.all(payload.things.map(k => {
        return Promise.all(k.images.map(v => {
          if (v.url.startsWith('cloud://')) return { fileID: v.url }
          return wx.cloud.uploadFile({
            filePath: v.url,
            cloudPath: v.url.split('/').at(-1),
          })
        }))
      }))
      payload.things.forEach((k, i) => {
        k.images = result[i].map(v => ({ url: v.fileID }))
      });
      await wx.cloud.models.huibao.update({
        filter: { where: { _id: { $eq: this.report } } },
        data: { [this.kind]: JSON.stringify(payload) }
      })
      wx.hideLoading()
      wx.navigateBack()
    } catch (err) {
      wx.showToast({ mask: true, icon: 'error', title: '保存失败' })
      console.log(err)
    }
  },

  async onLoad({ report, kind }) {
    this.report = report
    this.kind = kind
    const { data } = await wx.cloud.models.huibao.get({
      filter: { where: { _id: { $eq: report } } },
      select: { publish: true, [kind]: true }
    })
    const value = kinds[kind]
    wx.setNavigationBarTitle({ title: value.title })
    this.setData({
      publish: data.publish,
      payload: data[kind] ? JSON.parse(data[kind]) : value.payload
    })
  },
})