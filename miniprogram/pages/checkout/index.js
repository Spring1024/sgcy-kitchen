const api = require('../../utils/api');
const storage = require('../../utils/storage');

const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const ALL_HOURS = ['10','11','12','13','14','15','16','17','18','19','20','21'];

Page({
  data: {
    cart: [],
    eatType: 'today',
    remark: '',
    contactName: '',
    contactPhone: '',
    hours: [],
    minutes: ['00', '15', '30', '45'],
    hour: '12', minute: '00',
    hourIndex: 0, minuteIndex: 0,
    weekDates: [],
    reserveDay: 1,
    timeLabel: '',
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
    // 先把购物车写入 data，再初始化时间和价格
    this.setData({ cart }, () => {
      this.initTime();
      this.recalcPrice();
    });
  },

  initTime() {
    const now = new Date();
    const curHour = now.getHours();
    const curMinute = now.getMinutes();

    // 当天：可选小时从当前时间起（当前小时分钟已过45则跳过），最晚21点
    const todayHours = [];
    for (let i = curHour; i <= 21; i++) {
      if (i === curHour && curMinute > 45) continue;
      todayHours.push(String(i).padStart(2, '0'));
    }

    // 当天：当前小时的分钟选项限制（只能选择当前分钟之后的刻度）
    const todayMinutes = curMinute <= 15 ? ['15', '30', '45']
      : curMinute <= 30 ? ['30', '45']
      : ['45'];

    // 预约：时分不受限制，从明天开始
    const weekDates = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      weekDates.push({
        offset: i,
        month: d.getMonth() + 1,
        date: d.getDate(),
        week: WEEK_DAYS[d.getDay()],
      });
    }

    const defaultHour = todayHours[0] || '10';
    const defaultMinute = todayMinutes[0] || '00';

    this.setData({
      todayHours,        // 当天可用小时
      todayMinutes,      // 当天当前小时的可用分钟
      hours: todayHours, // 当前显示的小时（随 eatType 切换）
      minutes: ['00', '15', '30', '45'],
      weekDates,
      hour: defaultHour,
      minute: defaultMinute,
      hourIndex: 0,
      minuteIndex: 0,
      reserveDay: 1,
    }, () => this.updateTimeLabel());
  },

  setType(e) {
    const type = e.currentTarget.dataset.type;
    if (type === 'today' && this.data.todayHours.length === 0) {
      wx.showToast({ title: '今日已无法下单，请选择预约', icon: 'none' });
      return;
    }

    // 切换类型时，重置时分选项
    if (type === 'today') {
      this.setData({
        eatType: type,
        hours: this.data.todayHours,
        hour: this.data.todayHours[0] || '10',
        hourIndex: 0,
      }, () => this.updateTimeLabel());
    } else {
      // 预约：时分不受限制
      this.setData({
        eatType: type,
        hours: ALL_HOURS,
        hour: '10',
        hourIndex: 0,
        minuteIndex: 0,
        minute: '00',
      }, () => this.updateTimeLabel());
    }
  },

  selectDay(e) {
    this.setData({ reserveDay: e.currentTarget.dataset.offset }, () => this.updateTimeLabel());
  },

  onHourChange(e) {
    const idx = Number(e.detail.value);
    const hour = this.data.hours[idx];

    // 当天模式：如果选的是当前小时，分钟选项受限
    let minutes = ['00', '15', '30', '45'];
    if (this.data.eatType === 'today') {
      const now = new Date();
      const curHour = now.getHours();
      const curMinute = now.getMinutes();
      if (parseInt(hour) === curHour) {
        minutes = curMinute <= 15 ? ['15', '30', '45']
          : curMinute <= 30 ? ['30', '45']
          : ['45'];
      }
    }

    this.setData({
      hourIndex: idx,
      hour,
      minutes,
      minuteIndex: 0,
      minute: minutes[0],
    }, () => this.updateTimeLabel());
  },

  onMinuteChange(e) {
    const idx = Number(e.detail.value);
    this.setData({ minuteIndex: idx, minute: this.data.minutes[idx] }, () => this.updateTimeLabel());
  },

  onRemark(e) { this.setData({ remark: e.detail.value }); },
  onContactName(e) { this.setData({ contactName: e.detail.value }); },
  onContactPhone(e) { this.setData({ contactPhone: e.detail.value }); },

  updateTimeLabel() {
    const { eatType, hour, minute, weekDates, reserveDay } = this.data;
    let label;
    if (eatType === 'today') {
      label = `今天 ${hour}:${minute}`;
    } else {
      const d = weekDates.find(w => w.offset === reserveDay) || weekDates[0];
      label = `${d.month}月${d.date}日 ${d.week} ${hour}:${minute}`;
    }
    this.setData({ timeLabel: label });
  },

  recalcPrice() {
    const cart = this.data.cart;
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    this.setData({
      total: total.toFixed(2),
      pointsEarned: Math.floor(total / 10),
    });
  },

  async submit() {
    if (this.data.submitting) return;
    // 校验营业状态
    try {
      const cfg = await api.shopConfig();
      if (cfg && cfg.isOpen === false) {
        wx.showToast({ title: '已打烊，可私聊店长营业', icon: 'none' });
        this.setData({ submitting: false });
        return;
      }
    } catch (e) {}
    this.setData({ submitting: true });
    try {
      const { eatType, timeLabel, remark, contactName, contactPhone, cart } = this.data;
      const res = await api.orderCreate({
        items: cart.map(c => ({
          menuId: c.menuId, name: c.name, price: c.price,
          quantity: c.quantity, image: c.image, specText: c.specText || '',
        })),
        type: eatType,
        timeLabel,
        remark,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
      });
      if (res.error) throw new Error(res.error);
      storage.clearCart();
      wx.showToast({ title: '下单成功', icon: 'success' });
      setTimeout(() => {
        wx.redirectTo({ url: `/pages/order-detail/index?id=${res.orderId}` });
      }, 800);
    } catch (e) {
      wx.showToast({ title: e.message || '下单失败', icon: 'none' });
      this.setData({ submitting: false });
    }
  },
});
