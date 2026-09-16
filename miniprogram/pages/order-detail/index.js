const api = require('../../utils/api');

const STATUS_TEXT = { pending: '待处理', cooking: '备餐中', done: '已完成', cancelled: '已取消' };

Page({
  data: {
    order: null,
    reviewed: false,      // 是否已评价
    existingReviews: [],  // 已评价内容（只读展示）
    formReviews: [],      // 提交表单：每个菜品一项 {menuId, name, rating, content}
    reviewSubmitting: false,
  },

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

    // 已完成订单：检查是否已评价
    let reviewed = false;
    let existingReviews = [];
    if (order.status === 'done') {
      try {
        const my = await api.reviewMyList();
        existingReviews = (my || []).filter(r => r.orderId === order.orderId);
        reviewed = existingReviews.length > 0;
      } catch (e) {}
    }

    // 表单初始化：每个菜品一项
    const formReviews = order.items.map(it => ({
      menuId: it.menuId || '',
      name: it.name,
      rating: 5,
      content: '',
    }));

    this.setData({ order, reviewed, existingReviews, formReviews });
  },

  onRate(e) {
    const { idx, score } = e.currentTarget.dataset;
    this.setData({ [`formReviews[${idx}].rating`]: score });
  },

  onContentInput(e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({ [`formReviews[${idx}].content`]: e.detail.value });
  },

  submitReview() {
    if (this.data.reviewSubmitting) return;
    wx.showModal({
      title: '确认提交评价',
      content: '评价提交后不可修改，每个订单仅可评价一次。确认提交吗？',
      confirmText: '确认提交',
      cancelText: '再想想',
      success: async (res) => {
        if (!res.confirm) return;
        await this.doSubmit();
      },
    });
  },

  async doSubmit() {
    this.setData({ reviewSubmitting: true });
    try {
      const { order, formReviews } = this.data;
      for (const r of formReviews) {
        await api.reviewCreate({
          orderId: order.orderId,
          menuId: r.menuId,
          dishName: r.name,
          rating: r.rating,
          content: r.content,
        });
      }
      wx.showToast({ title: '评价成功', icon: 'success' });
      // 刷新为只读态
      this.load();
    } catch (e) {
      wx.showToast({ title: e.message || '提交失败', icon: 'none' });
    } finally {
      this.setData({ reviewSubmitting: false });
    }
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
