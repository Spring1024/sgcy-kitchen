// 设备适配工具：获取系统信息和动态高度值
function getSystem() {
  const app = getApp();
  return {
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    safeAreaBottom: app.globalData.safeAreaBottom,
    navBarHeight: app.globalData.navBarHeight,
  };
}

// 获取弹窗/面板的最大高度（px），ratio 0-1
function modalHeight(ratio = 0.8) {
  return Math.floor(getSystem().windowHeight * ratio);
}

module.exports = { getSystem, modalHeight };
