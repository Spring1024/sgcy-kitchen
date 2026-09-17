const api = require('../../utils/api');
const auth = require('../../utils/auth');

Page({
  data: { reviews: [], loading: true },

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
      this.setData({ reviews, loading: false });
    } catch (e) {
      console.error(e);
      this.setData({ loading: false });
    }
  },

  goOrder(e) {
    wx.navigateTo({ url: `/pages/order-detail/index?id=${e.currentTarget.dataset.id}` });
  },
});
