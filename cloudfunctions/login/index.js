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
  const arr = await Promise.all([streetsFind(phone), companiesFind(phone)])
  if (arr[0]) return arr[0]
  return arr[1]
}

async function streetsFind(phone) {
  const { data } = await client.models.streets.list({
    filter: { where: { contactPhone: { $eq: phone } } },
    select: { name: true, contactName: true }
  })
  if (!data.records.length) return null
  return {
    phone,
    name: data.records[0].contactName,
    street: data.records,
    role: 'admin',
  }
}

async function companiesFind(phone) {
  const { data } = await client.models.companies.list({
    filter: { where: { staffPhone: { $eq: phone } } },
    select: { name: true, address: true, street: true, staffName: true }
  })
  if (!data.records.length) return null
  return {
    phone,
    name: data.records[0].staffName,
    company: data.records,
    role: 'staff',
  }
}