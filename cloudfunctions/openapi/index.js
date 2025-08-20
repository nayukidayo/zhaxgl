// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const appid = cloud.getWXContext().FROM_APPID || cloud.getWXContext().APPID
  const result = await cloud.openapi({ appid })[event.method](event.param)
  return result
}