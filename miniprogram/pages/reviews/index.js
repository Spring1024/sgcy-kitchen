const api = require('../../utils/api');
const auth = require('../../utils/auth');

Page({
  data: { reviews: [] },

  async onShow() {
    await auth.ensureLogin();
    this.load();
  },

  async load() {
    try {
      const list = await api.reviewMyList();
      const reviews = (list || []).map(r => ({
        ...r,
        timeLabel: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
      }));
      this.setData({ reviews });
    } catch (e) {
      console.error(e);
    }
  },

  goOrder(e) {
    wx.navigateTo({ url: `/pages/order-detail/index?id=${e.currentTarget.dataset.id}` });
  },
});
