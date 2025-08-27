// 云函数入口文件
const cloud = require('wx-server-sdk')
const { init } = require('@cloudbase/wx-cloud-client-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const client = init(cloud)

// 云函数入口函数
exports.main = async (event, context) => {
  const result = await cloud.openapi.phonenumber.getPhoneNumber({
    code: event.code
  })
  const phone = result.phoneInfo.purePhoneNumber
  let data = await getUserByPhone(phone)
  if (data._id) return data
  await client.models.users.create({
    data: { phone, _openid: cloud.getWXContext().OPENID }
  })
  data = await getUserByPhone(phone)
  return data
}

async function getUserByPhone(phone) {
  const { data } = await client.models.users.get({
    filter: { where: { phone: { $eq: phone } } },
    select: { name: true, phone: true, role: true, street: { name: true, code: true }, company: { name: true, address: true } }
  })
  return data
}