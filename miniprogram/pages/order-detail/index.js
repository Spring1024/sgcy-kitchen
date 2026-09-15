const api = require('../../utils/api');

const STATUS_TEXT = { pending: '待处理', cooking: '备餐中', done: '已完成', cancelled: '已取消' };

Page({
  data: { order: null },

  async onLoad(options) {
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
    this.setData({ order });
  },

  cancelOrder() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消该订单吗？',
      success: async (res) => {
        if (!res.confirm) return;
        const r = await api.orderCancel(this.orderId);
        if (r.error) {
          wx.showToast({ title: r.error, icon: 'none' });
        } else {
          wx.showToast({ title: '已取消', icon: 'success' });
          this.load();
        }
      },
    });
  },
});
