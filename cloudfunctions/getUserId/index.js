// 云函数入口文件
const tcb = require("@cloudbase/node-sdk")

const app = tcb.init({ env: 'cloud1-1g13x2oo3d8984d5' })

// 云函数入口函数
exports.main = async (event, context) => {
  const { openId } = app.auth().getUserInfo()
  let userId = await getId(openId)
  if (!userId) {
    userId = await createId(openId)
  }
  return userId
}

async function getId(openId) {
  const { data } = await app.models.user.get({
    filter: { where: { _openid: { $eq: openId } } },
    select: { _id: true }
  })
  return data._id
}

async function createId(openId) {
  const { data } = await app.models.user.create({
    data: { _openid: openId }
  })
  return data.id
}