const api = require('../../utils/api');
const storage = require('../../utils/storage');

Page({
  data: {
    loading: true,
    dish: null,
    selectedSpecs: {},
    quantity: 1,
    totalPrice: '0.00',
  },

  async onLoad(options) {
    try {
      const dish = await api.menuDetail(options.id);
      const defaults = {};
      (dish.specs || []).forEach(s => { if (s.options && s.options[0]) defaults[s.label] = s.options[0]; });
      this.setData({ dish, selectedSpecs: defaults, loading: false }, () => this.recalc());
    } catch (e) {
      this.setData({ loading: false });
    }
  },

  selectSpec(e) {
    const { label, value } = e.currentTarget.dataset;
    this.setData({ [`selectedSpecs.${label}`]: value }, () => this.recalc());
  },

  minus() { if (this.data.quantity > 1) this.setData({ quantity: this.data.quantity - 1 }, () => this.recalc()); },
  plus() { this.setData({ quantity: this.data.quantity + 1 }, () => this.recalc()); },

  recalc() {
    let extra = 0;
    Object.values(this.data.selectedSpecs).forEach(opt => {
      const m = String(opt).match(/\+¥(\d+(\.\d+)?)/);
      if (m) extra += parseFloat(m[1]);
    });
    this.setData({ totalPrice: ((this.data.dish.price + extra) * this.data.quantity).toFixed(2) });
  },

  addToCart() {
    const { dish, selectedSpecs, quantity } = this.data;
    const cart = storage.getCart();
    const specKey = Object.values(selectedSpecs).join('/');
    const key = specKey ? `${dish._id}__${specKey}` : dish._id;
    let extra = 0;
    Object.values(selectedSpecs).forEach(opt => {
      const m = String(opt).match(/\+¥(\d+(\.\d+)?)/);
      if (m) extra += parseFloat(m[1]);
    });
    const unitPrice = dish.price + extra;
    const idx = cart.findIndex(c => c.key === key);
    if (idx >= 0) cart[idx].quantity += quantity;
    else cart.push({ key, menuId: dish._id, name: dish.name, price: unitPrice, quantity, image: dish.image, specText: specKey });
    storage.saveCart(cart);
    wx.showToast({ title: '已加入购物车', icon: 'success' });
  },

  goBack() { wx.navigateBack(); },
});
