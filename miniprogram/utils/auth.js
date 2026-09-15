// 登录态管理
const api = require('./api');

async function ensureLogin() {
  const app = getApp();
  if (app.globalData.openid) return app.globalData.openid;

  const { code } = await wx.login();
  const result = await api.login(code);
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
