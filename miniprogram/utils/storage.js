// 本地存储封装
const CART_KEY = 'sgcy_cart';

function getCart() {
  try { return wx.getStorageSync(CART_KEY) || []; } catch (e) { return []; }
}

function saveCart(cart) {
  wx.setStorageSync(CART_KEY, cart);
}

function clearCart() {
  wx.removeStorageSync(CART_KEY);
}

module.exports = { getCart, saveCart, clearCart };
