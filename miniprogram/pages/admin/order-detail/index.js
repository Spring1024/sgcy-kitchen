const api = require('../../../utils/api');

const STATUS_TEXT = { pending: '待处理', cooking: '备餐中', done: '已完成', cancelled: '已取消' };

Page({
  data: { order: null, totalQty: 0 },

  onLoad(options) {
    this.orderId = options.id;
    this.load();
  },

  async load() {
    const order = await api.orderDetail(this.orderId);
    if (order.error) {
      wx.showToast({ title: order.error, icon: 'none' });
      return;
    }
    order.statusText = STATUS_TEXT[order.status] || order.status;
    const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);
    this.setData({ order, totalQty });
  },

  async update(e) {
    await api.orderUpdate(this.orderId, e.currentTarget.dataset.status);
    wx.showToast({ title: '已更新', icon: 'success' });
    this.load();
  },

  cancel() {
    wx.showModal({
      title: '取消订单', content: '确认取消该订单？',
      success: async (r) => {
        if (!r.confirm) return;
        await api.orderUpdate(this.orderId, 'cancelled');
        wx.showToast({ title: '已取消', icon: 'success' });
        this.load();
      },
    });
  },

  goPage(e) { wx.redirectTo({ url: e.currentTarget.dataset.url }); },
});
