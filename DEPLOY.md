# sgcy-kitchen 微信小程序

原生 WXML + 腾讯云 CloudBase（云函数 + 云数据库 + 云存储）的点餐小程序。

## 部署步骤

### 1. 填入配置

- `project.config.json` → `appid` 填入你的小程序 AppID
- `miniprogram/config/env.js` → `ENV_ID` 填入 CloudBase 环境 ID

### 2. 微信开发者工具导入

用微信开发者工具打开本目录（`D:\WorkSpace\sgcy-kitchen`）。

### 3. 初始化云开发

1. 点击工具栏"云开发"，开通环境（如未开通）
2. 在 `cloudfunctions/` 下的 4 个云函数（login、menu、order、shop）上分别右键 → "上传并部署：云端安装依赖"
3. 在云开发控制台"数据库"中手动创建 4 个集合：`users`、`menus`、`orders`、`shop_config`
   - 详细 schema 见 `cloudfunctions/SCHEMA.md`
4. 数据库权限设置：
   - `users`、`orders`：仅创建者可读写（云函数可读写）
   - `menus`、`shop_config`：所有用户可读，仅云函数可写
5. 运行一次种子数据初始化：
   - 云开发控制台 → 云函数 → shop → 云端测试
   - 修改 shop/index.js 的 main 临时导出 seed 逻辑，或单独部署 seed 为独立云函数执行一次

### 4. 设置商家账号

首次微信授权登录后，在云开发控制台 users 集合中找到你的记录，将 `role` 改为 `admin`。

### 5. 替换默认头像

`miniprogram/images/default-avatar.png` 目前是 SVG 内容占位，需替换为真实 PNG 图片。

## 目录结构

```
miniprogram/            # 小程序端
  pages/order/          # 点餐首页（tabBar）
  pages/orders/         # 订单列表（tabBar）
  pages/profile/        # 个人中心（tabBar）
  pages/detail/         # 菜品详情
  pages/checkout/       # 结算
  pages/order-detail/   # 用户订单详情
  pages/admin/menu/     # 商家-菜品管理
  pages/admin/orders/   # 商家-订单管理
  pages/admin/order-detail/
  pages/admin/profile/  # 商家-中心
  components/cart-panel/
  utils/{api,auth,storage}.js
  config/env.js
cloudfunctions/         # 云函数
  login/                # 登录 + 用户信息
  menu/                 # 菜品 CRUD
  order/                # 订单 CRUD + 积分发放
  shop/                 # 店铺配置 + 种子数据 seed.js
```

## 积分规则

- 默认每消费 10 元积 1 分（在 `shop_config.pointsPerYuan` 中配置）
- 订单状态变为 `done` 时自动发放（在 `cloudfunctions/order/index.js` 的 `update` action 中）
- 无支付功能；积分仅由后台发放

## 已知的后续工作

- 点餐首页/订单页 UI 为简洁实现，未完全复刻 JSX 版本的渐变、动画细节
- 订单状态变更后用户端不会收到实时推送（如需，可接入订阅消息）
- 图片需管理员在菜品管理中上传至云存储
