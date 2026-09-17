const api = require('../../../utils/api');

const STATUS_TEXT = { pending: '待处理', cooking: '备餐中', done: '已完成', cancelled: '已取消' };

Page({
  data: {
    loading: true,
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'pending', label: '待处理' },
      { key: 'cooking', label: '备餐中' },
      { key: 'done', label: '已完成' },
      { key: 'cancelled', label: '已取消' },
    ],
    tab: 'all',
    orders: [],
    filtered: [],
  },

  onShow() { this.load(); },

  onPullDownRefresh() { this.load().then(() => wx.stopPullDownRefresh()); },

  async load() {
    try {
      const list = await api.orderAdminList({});
      const orders = (list || []).map(o => ({ ...o, statusText: STATUS_TEXT[o.status] || o.status }));
      this.setData({ orders, loading: false }, () => this.applyFilter());
    } catch (e) {
      this.setData({ loading: false });
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    }
  },

  setTab(e) {
    this.setData({ tab: e.currentTarget.dataset.key }, () => this.applyFilter());
  },

  applyFilter() {
    const { tab, orders } = this.data;
    const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab);
    this.setData({ filtered });
  },

  async update(e) {
    const { id, status } = e.currentTarget.dataset;
    await api.orderUpdate(id, status);
    wx.showToast({ title: '已更新', icon: 'success' });
    this.load();
  },

  cancel(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '取消订单', content: '确认取消该订单？',
      success: async (r) => {
        if (!r.confirm) return;
        await api.orderUpdate(id, 'cancelled');
        wx.showToast({ title: '已取消', icon: 'success' });
        this.load();
      },
    });
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/admin/order-detail/index?id=${e.currentTarget.dataset.id}` });
  },

  goPage(e) { wx.redirectTo({ url: e.currentTarget.dataset.url }); },
  noop() {},
});
