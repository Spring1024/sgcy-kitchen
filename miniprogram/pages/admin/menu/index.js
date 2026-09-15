const api = require('../../../utils/api');

const DEFAULT_CATEGORIES = ['招牌推荐', '粉面系列', '米饭套餐', '小吃甜品', '饮品'];

Page({
  data: {
    items: [],
    filtered: [],
    query: '',
    onlineCount: 0,
    showForm: false,
    form: {},
    categories: DEFAULT_CATEGORIES,
  },

  onShow() { this.load(); },

  async load() {
    try {
      const list = await api.menuAdminList();
      const items = list || [];
      this.setData({
        items,
        onlineCount: items.filter(i => i.online).length,
      }, () => this.applyFilter());
    } catch (e) {
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    }
  },

  onSearch(e) {
    this.setData({ query: e.detail.value }, () => this.applyFilter());
  },

  applyFilter() {
    const q = this.data.query.trim();
    const filtered = this.data.items.filter(i =>
      !q || i.name.includes(q) || (i.category || '').includes(q)
    );
    this.setData({ filtered });
  },

  onAdd() {
    this.setData({
      showForm: true,
      form: { name: '', category: DEFAULT_CATEGORIES[0], price: '', stock: '', image: '', desc: '', tag: '', specsText: '' },
    });
  },

  onEdit(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      showForm: true,
      form: { ...item, price: String(item.price), stock: String(item.stock), specsText: item.specs ? JSON.stringify(item.specs) : '' },
    });
  },

  closeForm() { this.setData({ showForm: false }); },
  noop() {},

  onField(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onCatSelect(e) {
    this.setData({ 'form.category': e.currentTarget.dataset.cat });
  },

  async onPickImage() {
    const res = await wx.chooseMedia({ count: 1, mediaType: ['image'] });
    const tempFilePath = res.tempFiles[0].tempFilePath;
    wx.showLoading({ title: '上传中' });
    try {
      const cloudPath = `menus/${Date.now()}.jpg`;
      const up = await wx.cloud.uploadFile({ cloudPath, filePath: tempFilePath });
      this.setData({ 'form.image': up.fileID });
    } catch (err) {
      wx.showToast({ title: '上传失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  async onSave() {
    const f = this.data.form;
    if (!f.name.trim()) return wx.showToast({ title: '请填写菜品名称', icon: 'none' });
    if (!f.price || Number(f.price) <= 0) return wx.showToast({ title: '请填写有效价格', icon: 'none' });

    let specs = [];
    if (f.specsText && f.specsText.trim()) {
      try { specs = JSON.parse(f.specsText); }
      catch (e) { return wx.showToast({ title: '规格 JSON 格式错误', icon: 'none' }); }
    }

    const dish = {
      _id: f._id,
      name: f.name.trim(),
      category: f.category,
      price: Number(f.price),
      stock: Number(f.stock) || 0,
      image: f.image,
      desc: f.desc || '',
      tag: f.tag || '',
      specs,
    };

    try {
      await api.menuSave(dish);
      wx.showToast({ title: '已保存', icon: 'success' });
      this.setData({ showForm: false });
      this.load();
    } catch (e) {
      wx.showToast({ title: e.message || '保存失败', icon: 'none' });
    }
  },

  async onToggle(e) {
    const { id, online } = e.currentTarget.dataset;
    await api.menuToggle(id, !online);
    wx.showToast({ title: online ? '已下架' : '已上架', icon: 'success' });
    this.load();
  },

  goPage(e) {
    wx.redirectTo({ url: e.currentTarget.dataset.url });
  },
});
