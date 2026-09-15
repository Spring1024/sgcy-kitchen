const { ENV_ID } = require('./config/env');

App({
  globalData: {
    openid: '',
    userInfo: null,
    shopConfig: null,
    cart: [],
    // 系统信息
    windowHeight: 0,    // 可视区域高度（不含导航栏和 tabBar）
    windowWidth: 0,
    safeAreaBottom: 0,  // 底部安全区域（刘海屏 home 条）
    navBarHeight: 0,    // 导航栏高度
  },

  onLaunch() {
    if (!wx.cloud) {
      console.error('当前微信版本过低');
      return;
    }
    wx.cloud.init({ env: ENV_ID, traceUser: true });

    const sysInfo = wx.getWindowInfo();
    const menuInfo = wx.getMenuButtonBoundingClientRect();
    const { screenHeight, windowWidth } = sysInfo;
    const safeAreaBottom = sysInfo.safeArea
      ? screenHeight - sysInfo.safeArea.bottom
      : 0;
    // 导航栏高度 = 状态栏 + 间距 + 菜单按钮 + 间距
    const navBarHeight = menuInfo.top * 2 + menuInfo.height;

    this.globalData.windowHeight = sysInfo.windowHeight;
    this.globalData.windowWidth = windowWidth;
    this.globalData.safeAreaBottom = safeAreaBottom;
    this.globalData.navBarHeight = navBarHeight;
  },
});
