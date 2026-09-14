import ORDER from '../pages/order.jsx';
import CHECKOUT from '../pages/checkout.jsx';
import DETAIL from '../pages/detail.jsx';
import ORDERS from '../pages/orders.jsx';
import PROFILE from '../pages/profile.jsx';
import ADMIN_MENU from '../pages/admin-menu.jsx';
import ADMIN_ORDERS from '../pages/admin-orders.jsx';
import ADMIN_PROFILE from '../pages/admin-profile.jsx';
import ADMIN_ORDER-DETAIL from '../pages/admin-order-detail.jsx';
export const routers = [{
  id: "order",
  component: ORDER
}, {
  id: "checkout",
  component: CHECKOUT
}, {
  id: "detail",
  component: DETAIL
}, {
  id: "orders",
  component: ORDERS
}, {
  id: "profile",
  component: PROFILE
}, {
  id: "admin-menu",
  component: ADMIN_MENU
}, {
  id: "admin-orders",
  component: ADMIN_ORDERS
}, {
  id: "admin-profile",
  component: ADMIN_PROFILE
}, {
  id: "admin-order-detail",
  component: ADMIN_ORDER-DETAIL
}]