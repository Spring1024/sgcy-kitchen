const api = require('../../../utils/api');

const QUICK_OPTIONS = ['辣度', '甜度', '酸度'];

Page({
  data: {
    loading: true,
    items: [],
    filtered: [],
    query: '',
    onlineCount: 0,
    showForm: false,
    form: {},
    categories: [],
    quickOptions: QUICK_OPTIONS,
    newSpecName: '',
    newValues: {},  // { specIdx: '当前输入值' }
  },

  onShow() {
    this.load();
    this.loadCategories();
  },

  async loadCategories() {
    try {
      const list = await api.menuCategoryList();
      this.setData({ categories: (list || []).map(c => c.name) });
    } catch (e) {}
  },

  async load() {
    try {
      const list = await api.menuAdminList();
      const items = list || [];
      this.setData({
        items,
        onlineCount: items.filter(i => i.online).length,
        loading: false,
      }, () => this.applyFilter());
    } catch (e) {
      this.setData({ loading: false });
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
    const firstCat = this.data.categories[0] || '';
    this.setData({
      showForm: true,
      form: { name: '', category: firstCat, price: '', stock: '', image: '', desc: '', tag: '', specs: [] },
      newSpecName: '',
      newValues: {},
    });
  },

  onEdit(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      showForm: true,
      form: {
        ...item,
        price: String(item.price),
        stock: String(item.stock),
        specs: item.specs || [],
      },
      newSpecName: '',
      newValues: {},
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

  // ---- 自定义配置项 ----
  onQuickAdd(e) {
    const name = e.currentTarget.dataset.name;
    const specs = this.data.form.specs.slice();
    if (specs.some(s => s.label === name)) return;
    specs.push({ label: name, options: [] });
    this.setData({ 'form.specs': specs });
  },

  onNewSpecName(e) {
    this.setData({ newSpecName: e.detail.value });
  },

  onSpecAdd() {
    const name = this.data.newSpecName.trim();
    if (!name) return;
    const specs = this.data.form.specs.slice();
    if (specs.some(s => s.label === name)) {
      wx.showToast({ title: '该配置项已存在', icon: 'none' });
      return;
    }
    specs.push({ label: name, options: [] });
    this.setData({ 'form.specs': specs, newSpecName: '' });
  },

  onSpecRemove(e) {
    const idx = e.currentTarget.dataset.idx;
    const specs = this.data.form.specs.slice();
    specs.splice(idx, 1);
    this.setData({ 'form.specs': specs });
  },

  onNewValueInput(e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({ [`newValues.${idx}`]: e.detail.value });
  },

  onOptionAdd(e) {
    const idx = e.currentTarget.dataset.idx;
    const val = (this.data.newValues[idx] || '').trim();
    if (!val) return;
    const specs = this.data.form.specs.slice();
    if (specs[idx].options.includes(val)) return;
    specs[idx].options.push(val);
    this.setData({ 'form.specs': specs, [`newValues.${idx}`]: '' });
  },

  onOptionRemove(e) {
    const { sidx, oidx } = e.currentTarget.dataset;
    const specs = this.data.form.specs.slice();
    specs[sidx].options.splice(oidx, 1);
    this.setData({ 'form.specs': specs });
  },

  async onSave() {
    const f = this.data.form;
    if (!f.name.trim()) return wx.showToast({ title: '请填写菜品名称', icon: 'none' });
    if (!f.price || Number(f.price) <= 0) return wx.showToast({ title: '请填写有效价格', icon: 'none' });

    // 过滤掉没有选项值的配置项
    const specs = (f.specs || []).filter(s => s.options && s.options.length > 0);

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
