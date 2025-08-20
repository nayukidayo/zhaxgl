const app = getApp()

Page({
  data: {
    title: '',
    content: '',
    files: [],
    mediaType: ['image'],
    max: 3,
    gridConfig: {
      column: 4,
      width: 160,
      height: 160,
    },
    sizeLimit: {
      size: 5,
      unit: 'MB',
      message: '图片大小不超过 5 MB'
    },
    config: {
      count: 1,
    },
  },

  onSuccess(e) {
    this.setData({ files: e.detail.files })
  },

  onRemove(e) {
    const { files } = this.data;
    files.splice(e.detail.index, 1);
    this.setData({ files });
  },

  async onSubmit() {
    const { title, content, files } = this.data
    if (!title || !content || !files.length) {
      return wx.showToast({
        mask: true,
        icon: 'error',
        title: '请填写必填项',
      })
    }
    wx.showLoading({ mask: true, title: '提交中' })
    const result = await Promise.all(files.map(v => {
      return wx.cloud.uploadFile({
        filePath: v.url,
        cloudPath: v.url.split('/').at(-1),
      })
    }))
    const { _id, street } = app.global.user
    await wx.cloud.models.report.create({
      data: {
        title,
        content,
        photo: result.map(v => v.fileID),
        author: { _id },
        street: street[0]
      },
    })
    wx.hideLoading()
    wx.navigateBack()
  },

})