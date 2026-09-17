const api = require('../../utils/api');
const auth = require('../../utils/auth');

const STATUS_TEXT = { pending: '待处理', cooking: '备餐中', done: '已完成', cancelled: '已取消' };

Page({
  data: {
    loading: true,
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'active', label: '进行中' },
      { key: 'done', label: '已完成' },
      { key: 'cancelled', label: '已取消' },
    ],
    filter: 'all',
    orders: [],
  },

  async onShow() {
    await auth.ensureLogin();
    this.load();
  },

  onPullDownRefresh() {
    this.load().then(() => wx.stopPullDownRefresh());
  },

  setFilter(e) {
    this.setData({ filter: e.currentTarget.dataset.key }, () => this.load());
  },

  async load() {
    try {
      const list = await api.orderList({ status: this.data.filter });
      const orders = (list || []).map(o => ({ ...o, statusText: STATUS_TEXT[o.status] || o.status }));
      this.setData({ orders, loading: false });
    } catch (e) {
      console.error(e);
      this.setData({ loading: false });
    }
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/order-detail/index?id=${e.currentTarget.dataset.id}` });
  },
});
