async function updateUser(key, value) {
  const userId = wx.getStorageSync('userId')
  await wx.cloud.models.user.update({
    filter: { where: { _id: { $eq: userId } } },
    data: { [key]: value }
  })
  const user = wx.getStorageSync('user') || {}
  profile[key] = value
  wx.setStorageSync('profile', profile)
  return profile
}

module.exports = {
  updateUser,
}