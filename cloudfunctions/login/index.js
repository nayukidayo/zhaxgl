// 云函数入口文件
const cloud = require('wx-server-sdk')
const { init } = require('@cloudbase/wx-cloud-client-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const client = init(cloud)

// 云函数入口函数
exports.main = async (event, context) => {
  let result = await cloud.openapi.phonenumber.getPhoneNumber({
    code: event.code
  })
  const phone = result.phoneInfo.purePhoneNumber
  result = await client.models.user.get({
    filter: { where: { phone: { $eq: phone } } }
  })
  if (result.data._id) return result.data
  await client.models.user.create({
    data: { phone, _openid: cloud.getWXContext().OPENID }
  })
  result = await client.models.user.get({
    filter: { where: { phone: { $eq: phone } } }
  })
  return result.data
}
