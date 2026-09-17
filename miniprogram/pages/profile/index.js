const api = require('../../utils/api');
const auth = require('../../utils/auth');

Page({
  data: {
    loading: true,
    user: {},
    isAdmin: false,
    orderCount: 0,
  },

  async onShow() {
    await auth.ensureLogin();
    const user = auth.getUserInfo() || {};
    this.setData({ user, isAdmin: user.role === 'admin' });
    try {
      const orders = await api.orderList({ status: 'all', pageSize: 100 });
      this.setData({ orderCount: (orders || []).length });
    } catch (e) {}
    this.setData({ loading: false });
  },

  async onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    try {
      const cloudPath = `avatars/${Date.now()}.png`;
      const res = await wx.cloud.uploadFile({ cloudPath, filePath: avatarUrl });
      await api.updateProfile({ avatarUrl: res.fileID });
      const app = getApp();
      app.globalData.userInfo = { ...app.globalData.userInfo, avatarUrl: res.fileID };
      this.setData({ 'user.avatarUrl': res.fileID });
    } catch (err) {
      console.error(err);
      wx.showToast({ title: '上传失败', icon: 'none' });
    }
  },

  async onNicknameBlur(e) {
    const nickName = e.detail.value.trim();
    if (!nickName || nickName === this.data.user.nickName) return;
    await api.updateProfile({ nickName });
    const app = getApp();
    app.globalData.userInfo = { ...app.globalData.userInfo, nickName };
    this.setData({ 'user.nickName': nickName });
  },

  todo(e) {
    wx.showToast({ title: `${e.currentTarget.dataset.label} 开发中`, icon: 'none' });
  },

  goReview() {
    wx.navigateTo({ url: '/pages/reviews/index' });
  },

  goAdmin() {
    wx.navigateTo({ url: '/pages/admin/profile/index' });
  },
});
