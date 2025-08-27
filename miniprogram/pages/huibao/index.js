Page({
  data: {
    search: '',
    status: {
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
      value: '2025-01',
      start: '2025-01',
      end: '2025-01',
    },
    end: {
      visible: false,
      value: '2025-01',
      start: '2025-01',
      end: '2025-01',
    },
    records: [],
    isRefresh: false,
    isLower: false,
  },

  onSearch() {
    console.log(this.data);
    this.setData({
      records: [
        {
          _id: '123123123123',
          company: '公司名称公司名称公司名称公司名称',
          approve: 'ok',
          createdAt: Date.now(),
        },
        {
          _id: '456456456',
          company: '公司名称公',
          approve: 'ng',
          createdAt: Date.now(),
        },
        {
          _id: '86797897978',
          company: '公司名称公司名称公司名称公司名称司名称公司名称公司名称',
          approve: 'tbd',
          createdAt: Date.now(),
        },
        {
          _id: 'asdasd',
          company: '公司名称公司名称公司名称公司名称',
          approve: 'ok',
          createdAt: Date.now(),
        },
        {
          _id: 'zxczxc',
          company: '公司名称公',
          approve: 'ng',
          createdAt: Date.now(),
        },
        {
          _id: 'qweqwe',
          company: '公司名称公司名称公司名称公司名称司名称公司名称公司名称',
          approve: 'tbd',
          createdAt: Date.now(),
        },
        {
          _id: 'sffgdfg',
          company: '公司名称公司名称公司名称公司名称',
          approve: 'ok',
          createdAt: Date.now(),
        },
        {
          _id: 'rtyrty',
          company: '公司名称公',
          approve: 'ng',
          createdAt: Date.now(),
        },
        {
          _id: 'vbnvbn',
          company: '公司名称公司名称公司名称公司名称司名称公司名称公司名称',
          approve: 'tbd',
          createdAt: Date.now(),
        },
      ]
    })
  },

  onStatusChange(e) {
    this.setData({
      'status.value': e.detail.value
    }, () => this.onSearch())
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

  onRecordTap(e) {
    const id = e.mark.id
    console.log(id);
  },

  onRefresh() {
    this.setData({ isRefresh: true })
    console.log('onRefresh');
    setTimeout(() => {
      this.setData({ isRefresh: false })
    }, 1e3)
  },

  onLower() {
    this.setData({ isLower: true })
    console.log('onLower');
    setTimeout(() => {
      this.setData({ isLower: false })
    }, 1e3)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const date = new Date()
    date.setTime(date.getTime() + 8 * 60 * 60 * 1000)
    const max = date.toISOString().slice(0, 7)
    this.setData({
      'start.value': max,
      'end.value': max,
      'end.end': max,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})