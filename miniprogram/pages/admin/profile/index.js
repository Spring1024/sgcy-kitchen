const api = require('../../../utils/api');

Page({
  data: {
    shopConfig: {},
    todayRevenue: '0.00',
    menuCount: 0,
  },

  onShow() { this.load(); },

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
      });
    } catch (e) {
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    }
  },

  async toggleOpen() {
    const next = !this.data.shopConfig.isOpen;
    await api.shopToggle(next);
    this.setData({ 'shopConfig.isOpen': next });
    wx.showToast({ title: next ? '已营业' : '已打烊', icon: 'success' });
  },

  switchToUser() {
    wx.switchTab({ url: '/pages/order/index' });
  },

  goPage(e) { wx.redirectTo({ url: e.currentTarget.dataset.url }); },
});
