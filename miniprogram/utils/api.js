// 云函数统一调用封装
function call(name, action, data = {}) {
  return wx.cloud.callFunction({
    name,
    data: { action, ...data },
  }).then(res => res.result);
}

module.exports = {
  call,

  // login
  login: (code) => call('login', 'login', { code }),
  getUserInfo: (openid) => call('login', 'getUserInfo', { openid }),
  updateProfile: (data) => call('login', 'updateProfile', data),

  // menu
  menuList: () => call('menu', 'list'),
  menuDetail: (id) => call('menu', 'detail', { id }),
  menuAdminList: () => call('menu', 'adminList'),
  menuSave: (dish) => call('menu', 'save', { dish }),
  menuToggle: (id, online) => call('menu', 'toggle', { id, online }),
  menuDelete: (id) => call('menu', 'delete', { id }),

  // order
  orderCreate: (payload) => call('order', 'create', payload),
  orderList: (params) => call('order', 'list', params),
  orderDetail: (orderId) => call('order', 'detail', { orderId }),
  orderAdminList: (params) => call('order', 'adminList', params),
  orderUpdate: (orderId, status) => call('order', 'update', { orderId, status }),
  orderCancel: (orderId) => call('order', 'cancel', { orderId }),

  // shop
  shopConfig: () => call('shop', 'getConfig'),
  shopToggle: (isOpen) => call('shop', 'toggleOpen', { isOpen }),
};
