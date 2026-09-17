const api = require('../../utils/api');
const auth = require('../../utils/auth');
const storage = require('../../utils/storage');

Page({
  data: {
    loading: true,
    showAuthModal: false,
    pendingAvatar: '',
    pendingNick: '',
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
    await this.loadData();
    this._loaded = true;
    // 首次进入：未设置昵称时弹出授权弹窗
    const user = auth.getUserInfo();
    const skipKey = 'sgcy_auth_skip';
    const skipped = wx.getStorageSync(skipKey);
    if (user && !user.nickName && !skipped) {
      this.setData({ showAuthModal: true });
    }
  },

  // ---- 授权弹窗 ----
  onAuthChooseAvatar(e) {
    this.setData({ pendingAvatar: e.detail.avatarUrl });
  },
  onAuthNickInput(e) {
    this.setData({ pendingNick: e.detail.value });
  },
  onAuthSkip() {
    wx.setStorageSync('sgcy_auth_skip', Date.now());
    this.setData({ showAuthModal: false });
  },
  async onAuthConfirm() {
    const { pendingAvatar, pendingNick } = this.data;
    this.setData({ showAuthModal: false });
    const update = {};
    if (pendingNick.trim()) update.nickName = pendingNick.trim();
    if (pendingAvatar) {
      try {
        wx.showLoading({ title: '上传头像' });
        const cloudPath = `avatars/${Date.now()}.png`;
        const up = await wx.cloud.uploadFile({ cloudPath, filePath: pendingAvatar });
        update.avatarUrl = up.fileID;
      } catch (e) {
        wx.hideLoading();
      }
    }
    if (Object.keys(update).length > 0) {
      try {
        await api.updateProfile(update);
        const app = getApp();
        app.globalData.userInfo = { ...app.globalData.userInfo, ...update };
        wx.hideLoading();
        wx.showToast({ title: '设置成功', icon: 'success' });
      } catch (e) {
        wx.hideLoading();
      }
    }
  },

  onShow() {
    const cart = storage.getCart();
    this.setData({ cart }, () => this.recalcCart());
    // 首次 onLoad 已加载过数据，此处跳过重复请求
    if (this._loaded) {
      this.loadData();
    }
  },

  onPullDownRefresh() {
    this.loadData().then(() => wx.stopPullDownRefresh());
  },

  async loadData() {
    try {
      const [result, shopConfig] = await Promise.all([api.menuList(), api.shopConfig()]);
      const menus = result.dishes || result;  // 兼容旧返回格式
      const catList = result.categories || [];
      const grouped = {};
      menus.forEach(m => {
        const cat = m.category || '其他';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(m);
      });
      // 按数据库分类排序；分类下没菜品的也保留（显示空分类可选，这里过滤掉空分类）
      let categories = catList
        .filter(c => grouped[c.name])
        .map(c => ({ name: c.name, icon: c.icon || '🍽', items: grouped[c.name] }));
      // 数据库中未登记但菜品里存在的分类，追加到末尾
      Object.keys(grouped).forEach(name => {
        if (!catList.some(c => c.name === name)) {
          categories.push({ name, icon: '🍽', items: grouped[name] });
        }
      });
      this.setData({
        categories,
        shopConfig: shopConfig || {},
        activeCategory: categories[0] ? categories[0].name : '',
        loading: false,
      }, () => this.applyFilter());
    } catch (e) {
      console.error('loadData failed', e);
      this.setData({ loading: false });
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
