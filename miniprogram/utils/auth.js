// 登录态管理
const api = require('./api');

async function ensureLogin() {
  const app = getApp();
  if (app.globalData.openid) return app.globalData.openid;

  // 直接调用 login 云函数，无需传 code
  // 云函数内部通过 cloud.getWXContext().OPENID 自动获取用户 openid
  const result = await api.login();
  app.globalData.openid = result.openid;
  app.globalData.userInfo = result.userInfo;
  return result.openid;
}

function getOpenid() {
  return getApp().globalData.openid;
}

function getUserInfo() {
  return getApp().globalData.userInfo;
}

function isAdmin() {
  const u = getUserInfo();
  return u && u.role === 'admin';
}

module.exports = { ensureLogin, getOpenid, getUserInfo, isAdmin };
