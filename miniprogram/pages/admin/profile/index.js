const api = require('../../../utils/api');

// 订阅消息模板 ID（新订单 + 取消订单）
const SUBSCRIBE_TMPL_IDS = [
  'FBhVZWl7Pxf5C-rBFp3CkhnGgVnthOveynOyb8EJL_U',
  '0rtvwdpSTuKQYk151Khi2H_v7W6n0HHsl4FAIfxRTpw',
];

Page({
  data: {
    loading: true,
    shopConfig: {},
    todayRevenue: '0.00',
    menuCount: 0,
    subscribed: false,
  },

  onShow() {
    this.load();
    this.checkSubscribeStatus();
  },

  async load() {
    try {
      const [cfg, menus, orders] = await Promise.all([
        api.shopConfig(),
        api.menuAdminList(),
        api.orderAdminList({}),
      ]);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayRevenue = (orders || [])
        .filter(o => o.status === 'done' && new Date(o.createdAt) >= today)
        .reduce((s, o) => s + o.total, 0);
      this.setData({
        shopConfig: cfg || {},
        menuCount: (menus || []).filter(m => m.online).length,
        todayRevenue: todayRevenue.toFixed(2),
        loading: false,
      });
    } catch (e) {
      this.setData({ loading: false });
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    }
  },

  // 查询订阅状态
  // 只有长期订阅（勾选"总是保持以上选择"）才能持续接收推送
  // 一次性订阅次数用完后即失效，不视为已开启
  async checkSubscribeStatus() {
    try {
      const res = await wx.getSetting({ withSubscriptions: true });
      const settings = res.subscriptionsSetting || {};
      const hasLongTerm = SUBSCRIBE_TMPL_IDS.some(id => settings[id] === 'accept');
      this.setData({ subscribed: hasLongTerm });
    } catch (e) {
      this.setData({ subscribed: false });
    }
  },

  // 请求订阅消息授权
  requestSubscribe() {
    wx.requestSubscribeMessage({
      tmplIds: SUBSCRIBE_TMPL_IDS,
      success: (res) => {
        const allAccepted = SUBSCRIBE_TMPL_IDS.every(id => res[id] === 'accept');
        if (allAccepted) {
          // 只有长期订阅才算真正开启，一次性订阅次数用完后即失效
          wx.getSetting({
            withSubscriptions: true,
            success: (settingRes) => {
              const settings = settingRes.subscriptionsSetting || {};
              const hasLongTerm = SUBSCRIBE_TMPL_IDS.some(id => settings[id] === 'accept');
              this.setData({ subscribed: hasLongTerm });
              if (hasLongTerm) {
                wx.showToast({ title: '提醒已开启', icon: 'success' });
              } else {
                // 一次性授权，提示用户勾选长期订阅
                wx.showModal({
                  title: '提醒已开启（单次）',
                  content: '当前为一次性订阅，仅能接收一条推送。如需长期接收，请重新授权并勾选"总是保持以上选择"。',
                  showCancel: false,
                  confirmText: '我知道了',
                });
              }
            },
          });
        } else {
          this.setData({ subscribed: false });
          wx.showModal({
            title: '提醒未开启',
            content: '拒绝后将无法收到新订单推送。如需开启，请点击右上角"···"→ 设置 → 订阅消息，或勾选"总是保持以上选择"后重新授权。',
            showCancel: false,
            confirmText: '我知道了',
          });
        }
      },
      fail: (err) => {
        console.error('订阅请求失败', err);
        if (err.errCode === 20004) {
          wx.showModal({
            title: '订阅消息已关闭',
            content: '请在小程序右上角"···"→ 设置 → 订阅消息中开启总开关，或在微信"我→设置→通用→辅助功能→订阅消息"中开启。',
            showCancel: false,
            confirmText: '我知道了',
          });
        } else {
          wx.showToast({ title: '请求失败，请重试', icon: 'none' });
        }
      },
    });
  },

  // 手动点击卡片
  onSubscribeToggle() {
    if (this.data.subscribed) {
      wx.showToast({ title: '提醒已开启', icon: 'none' });
      return;
    }
    this.requestSubscribe();
  },

  async toggleOpen() {
    const next = !this.data.shopConfig.isOpen;
    await api.shopToggle(next);
    this.setData({ 'shopConfig.isOpen': next, 'shopConfig.autoOpen': false });
    wx.showToast({ title: next ? '已营业' : '已打烊', icon: 'success' });
  },

  async restoreAuto() {
    await api.shopSetAuto();
    wx.showToast({ title: '已恢复自动判断', icon: 'success' });
    this.load();
  },

  switchToUser() {
    wx.switchTab({ url: '/pages/order/index' });
  },

  goPage(e) { wx.redirectTo({ url: e.currentTarget.dataset.url }); },
});
