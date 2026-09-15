const api = require('../../utils/api');
const storage = require('../../utils/storage');

const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

Page({
  data: {
    cart: [],
    eatType: 'today',
    remark: '',
    hours: [],
    minutes: ['00', '15', '30', '45'],
    hour: '12', minute: '00',
    hourIndex: 2, minuteIndex: 0,
    weekDates: [],
    reserveDay: 0,
    timeLabel: '',
    subtotal: '0.00',
    packagingFee: 0,
    total: '0.00',
    pointsEarned: 0,
    submitting: false,
  },

  onLoad() {
    const cart = storage.getCart();
    if (cart.length === 0) {
      wx.showToast({ title: '购物车为空', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }
    const hours = [];
    for (let i = 10; i <= 21; i++) hours.push(String(i).padStart(2, '0'));
    const now = new Date();
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      weekDates.push({
        offset: i, month: d.getMonth() + 1, date: d.getDate(),
        week: WEEK_DAYS[d.getDay()], isToday: i === 0,
      });
    }
    this.setData({ cart, hours, weekDates }, () => {
      this.recalcPrice();
      this.updateTimeLabel();
    });
  },

  setType(e) {
    this.setData({ eatType: e.currentTarget.dataset.type }, () => this.updateTimeLabel());
  },
  selectDay(e) {
    this.setData({ reserveDay: e.currentTarget.dataset.offset }, () => this.updateTimeLabel());
  },
  onHourChange(e) {
    const idx = Number(e.detail.value);
    this.setData({ hourIndex: idx, hour: this.data.hours[idx] }, () => this.updateTimeLabel());
  },
  onMinuteChange(e) {
    const idx = Number(e.detail.value);
    this.setData({ minuteIndex: idx, minute: this.data.minutes[idx] }, () => this.updateTimeLabel());
  },
  onRemark(e) { this.setData({ remark: e.detail.value }); },

  updateTimeLabel() {
    const { eatType, hour, minute, weekDates, reserveDay } = this.data;
    let label;
    if (eatType === 'today') {
      label = `今天 ${hour}:${minute}`;
    } else {
      const d = weekDates[reserveDay];
      label = `${d.isToday ? '今天' : d.month + '月' + d.date + '日'} ${d.week} ${hour}:${minute}`;
    }
    this.setData({ timeLabel: label });
  },

  recalcPrice() {
    const cart = this.data.cart;
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const packagingFee = cart.length;
    const total = subtotal + packagingFee;
    this.setData({
      subtotal: subtotal.toFixed(2),
      packagingFee: packagingFee.toFixed(2),
      total: total.toFixed(2),
      pointsEarned: Math.floor(total / 10),
    });
  },

  async submit() {
    if (this.data.submitting) return;
    this.setData({ submitting: true });
    try {
      const { eatType, timeLabel, remark, cart } = this.data;
      const res = await api.orderCreate({
        items: cart.map(c => ({
          menuId: c.menuId, name: c.name, price: c.price,
          quantity: c.quantity, image: c.image, specText: c.specText || '',
        })),
        type: eatType,
        timeLabel,
        remark,
      });
      if (res.error) throw new Error(res.error);
      storage.clearCart();
      wx.showToast({ title: '下单成功', icon: 'success' });
      setTimeout(() => {
        wx.redirectTo({ url: `/pages/order-detail/index?id=${res.orderId}` });
      }, 800);
    } catch (e) {
      console.error(e);
      wx.showToast({ title: e.message || '下单失败', icon: 'none' });
      this.setData({ submitting: false });
    }
  },
});
