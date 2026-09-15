const api = require('../../utils/api');
const auth = require('../../utils/auth');
const storage = require('../../utils/storage');

const CATEGORY_ICONS = {
  '招牌推荐': '🔥', '粉面系列': '🍜', '米饭套餐': '🍚',
  '小吃甜品': '🥟', '饮品': '🥤', '招牌主食': '🍜',
  '热菜': '🍲', '汤品': '🍲', '甜品': '🍰',
};

Page({
  data: {
    shopConfig: {},
    categories: [],      // [{name, icon, items}]
    activeCategory: '',
    filteredItems: [],
    searchQuery: '',
    cart: [],
    totalCount: 0,
    totalPrice: '0.00',
    showCart: false,
    specItem: null,
    selectedSpecs: {},
    specQty: 1,
    specTotal: '0.00',
  },

  async onLoad() {
    await auth.ensureLogin();
    this.loadData();
  },

  onShow() {
    const cart = storage.getCart();
    this.setData({ cart }, () => this.recalcCart());
  },

  onPullDownRefresh() {
    this.loadData().then(() => wx.stopPullDownRefresh());
  },

  async loadData() {
    try {
      const [menus, shopConfig] = await Promise.all([api.menuList(), api.shopConfig()]);
      const grouped = {};
      menus.forEach(m => {
        const cat = m.category || '其他';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(m);
      });
      const categories = Object.keys(grouped).map(name => ({
        name, icon: CATEGORY_ICONS[name] || '🍽', items: grouped[name],
      }));
      this.setData({
        categories,
        shopConfig: shopConfig || {},
        activeCategory: categories[0] ? categories[0].name : '',
      }, () => this.applyFilter());
    } catch (e) {
      console.error('loadData failed', e);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  onSelectCategory(e) {
    this.setData({ activeCategory: e.currentTarget.dataset.name }, () => this.applyFilter());
  },

  onSearch(e) {
    this.setData({ searchQuery: e.detail.value }, () => this.applyFilter());
  },

  applyFilter() {
    const { categories, activeCategory, searchQuery } = this.data;
    const cat = categories.find(c => c.name === activeCategory);
    let items = cat ? cat.items : [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i =>
        (i.name || '').toLowerCase().includes(q) ||
        (i.desc || '').toLowerCase().includes(q)
      );
    }
    this.setData({ filteredItems: items });
  },

  // ---- 购物车逻辑 ----
  onAdd(e) {
    const item = e.currentTarget.dataset.item;
    if (item.specs && item.specs.length > 0) {
      // 打开规格弹窗，默认每项第一个
      const defaults = {};
      item.specs.forEach(s => { if (s.options && s.options[0]) defaults[s.label] = s.options[0]; });
      this.setData({ specItem: item, selectedSpecs: defaults, specQty: 1 }, () => this.recalcSpec());
    } else {
      this.addToCart(item, null, 1);
      wx.showToast({ title: '已加入', icon: 'success' });
    }
  },

  addToCart(item, specs, qty) {
    const cart = this.data.cart.slice();
    const specKey = specs ? Object.values(specs).join('/') : '';
    const key = specKey ? `${item._id}__${specKey}` : item._id;
    let extra = 0;
    if (specs) {
      Object.values(specs).forEach(opt => {
        const m = String(opt).match(/\+¥(\d+(\.\d+)?)/);
        if (m) extra += parseFloat(m[1]);
      });
    }
    const unitPrice = item.price + extra;
    const idx = cart.findIndex(c => c.key === key);
    if (idx >= 0) {
      cart[idx].quantity += qty;
    } else {
      cart.push({
        key, menuId: item._id, name: item.name,
        price: unitPrice, quantity: qty,
        image: item.image, specText: specKey,
      });
    }
    this.setData({ cart }, () => { this.recalcCart(); storage.saveCart(cart); });
  },

  onCartUpdate(e) {
    // cart-panel 组件抛出的更新后购物车
    const cart = e.detail.cart;
    this.setData({ cart }, () => { this.recalcCart(); storage.saveCart(cart); });
  },

  recalcCart() {
    const cart = this.data.cart;
    const totalCount = cart.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2);
    this.setData({ totalCount, totalPrice });
  },

  toggleCart() {
    this.setData({ showCart: !this.data.showCart });
  },

  goCheckout() {
    if (this.data.cart.length === 0) return;
    this.setData({ showCart: false });
    wx.navigateTo({ url: '/pages/checkout/index' });
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/detail/index?id=${e.currentTarget.dataset.id}` });
  },

  // ---- 规格弹窗 ----
  selectSpec(e) {
    const { label, value } = e.currentTarget.dataset;
    this.setData({ [`selectedSpecs.${label}`]: value }, () => this.recalcSpec());
  },
  specQtyMinus() {
    if (this.data.specQty > 1) this.setData({ specQty: this.data.specQty - 1 }, () => this.recalcSpec());
  },
  specQtyPlus() {
    this.setData({ specQty: this.data.specQty + 1 }, () => this.recalcSpec());
  },
  recalcSpec() {
    const { specItem, selectedSpecs, specQty } = this.data;
    if (!specItem) return;
    let extra = 0;
    Object.values(selectedSpecs).forEach(opt => {
      const m = String(opt).match(/\+¥(\d+(\.\d+)?)/);
      if (m) extra += parseFloat(m[1]);
    });
    this.setData({ specTotal: ((specItem.price + extra) * specQty).toFixed(2) });
  },
  confirmSpec() {
    this.addToCart(this.data.specItem, this.data.selectedSpecs, this.data.specQty);
    this.setData({ specItem: null });
    wx.showToast({ title: '已加入', icon: 'success' });
  },
  closeSpec() {
    this.setData({ specItem: null });
  },
  noop() {},
});
