// app.js
const { ENV_ID } = require('./config/env');

App({
  globalData: {
    openid: '',
    userInfo: null,   // users 集合中的完整记录
    shopConfig: null, // shop_config 集合记录
    cart: [],         // 购物车 [{ key, menuId, name, price, quantity, image, specs, specText }]
  },

  onLaunch() {
    if (!wx.cloud) {
      console.error('当前微信版本过低，请升级后使用');
      return;
    }
    wx.cloud.init({ env: ENV_ID, traceUser: true });
  },
});
