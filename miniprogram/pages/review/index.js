Page({
  data: {
    record: null,
  },

  onLoad() {
    this.getOpenerEventChannel().on('opener', data => {
      this.setData({ record: data })
    })
  },

})