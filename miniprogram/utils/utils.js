function getUserIdFn() {
  let userId = wx.getStorageSync('userId')
  return async () => {
    if (userId) return userId
    const { result } = await wx.cloud.callFunction({ name: 'getUserId' })
    userId = result
    wx.setStorageSync('userId', userId)
    return userId
  }
}

const getUserId = getUserIdFn()

async function getProfile() {
  let profile = wx.getStorageSync('profile')
  if (!profile) {
    const userId = await getUserId()
    const { data } = await wx.cloud.models.user.get({
      filter: { where: { _id: { $eq: userId } } },
      select: { avatar: true, name: true, phone: true, org_name: true, org_address: true },
    })
    profile = data
    wx.setStorageSync('profile', profile)
  }
  return profile
}

async function updateProfile(key, value) {
  const userId = await getUserId()
  await wx.cloud.models.user.update({
    filter: { where: { _id: { $eq: userId } } },
    data: { [key]: value }
  })
  const profile = wx.getStorageSync('profile') || {}
  profile[key] = value
  wx.setStorageSync('profile', profile)
  return profile
}

module.exports = {
  getUserId,
  getProfile,
  updateProfile,
}