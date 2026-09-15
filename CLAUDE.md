# sgcy-kitchen

## 项目概览

"味觉食堂" / "老街食肆" —— 基于 Cloudbase AI Builder（低代码平台）开发的点餐小程序前端。包含用户端（点餐、订单、个人中心）和商家端（菜品管理、订单管理、商家中心）两套独立界面。

---

## 技术栈

- **框架**: React 18（JSX，`src/App.jsx` 仅渲染 `OrderPage`，实际由路由系统驱动各页面）
- **样式**: Tailwind CSS（`src/tailwind.config.ts`），无全局 CSS 组件库，全部 Tailwind utility class
- **图标**: lucide-react
- **平台 API**: Cloudbase 运行时注入的 `props.$w` 对象（非真实小程序 SDK，由低代码平台模拟）
- **数据**: 全量本地 mock 常量，无后端集成，无状态管理库（Redux/Zustand 均未使用）

---

## 目录结构

```
src/
  App.jsx                  # 入口，仅渲染 OrderPage
  index.css                # Tailwind 基础层 + CSS 变量（含暗色模式，未实际使用）
  tailwind.config.ts       # 字体配置（DM Sans / Playfair Display）
  lowcode.json             # 低代码平台配置，main 页面为 "order"
  configs/
    routers.ts             # 路由注册表，新增页面必须在此登记
  components/
    index.js               # 组件统一出口
    CategoryBar.jsx        # 用户端左侧竖向分类导航
    MenuItem.jsx           # 用户端菜品卡片（含 TagBadge 子组件）
    CartPanel.jsx          # 用户端购物车底部抽屉（含自定义 slideUp 动画）
    TabBar.jsx             # 用户端底部导航（order / orders / profile）
    AdminTabBar.jsx        # 商家端底部导航（admin-menu / admin-orders / admin-profile）
    SpecModal.jsx          # 用户端规格选择底部弹窗（份量、辣度等）
    DishFormModal.jsx      # 商家端菜品新增/编辑弹窗（支持自定义配置项维度）
  pages/
    order.jsx              # 用户端 - 点餐首页（左侧分类 + 右侧菜品列表 + 购物车）
    checkout.jsx           # 用户端 - 结算页（含当天/预约时间选择）
    detail.jsx             # 用户端 - 菜品详情页（规格、配料、加入购物车）
    orders.jsx             # 用户端 - 我的订单列表
    profile.jsx            # 用户端 - 个人中心（含切换商家端入口）
    admin-menu.jsx         # 商家端 - 菜品管理（增删改查、上下架）
    admin-orders.jsx       # 商家端 - 订单列表（按状态筛选、状态流转）
    admin-order-detail.jsx # 商家端 - 订单详情（状态操作）
    admin-profile.jsx      # 商家端 - 商家中心（营业状态、切换用户端）
```

---

## Cloudbase 运行时 API（props.$w）

所有页面通过 props 接收平台注入对象，关键路径：

| 路径 | 用途 |
|------|------|
| `props.$w.utils.navigateTo({ pageId, params })` | 导航到新页面（页面入栈） |
| `props.$w.utils.navigateBack()` | 返回上一页 |
| `props.$w.utils.redirectTo({ pageId, params })` | 跳转替换当前页 |
| `props.$w.page.dataset.params.id` | 读取当前页路由参数 |
| `props.$w.auth.currentUser` | 获取当前登录用户（nickName / userId / avatarUrl） |
| `useToast()` from `@/components/ui` | 全局 Toast 通知（平台提供） |

**路由 ID 必须与 `src/configs/routers.ts` 中注册的 id 完全一致。**

---

## 路由注册

新页面需在 `src/configs/routers.ts` 中追加条目：

```ts
import NewPage from '../pages/new-page.jsx';
export const routers = [
  // ...已有条目
  { id: "new-page", component: NewPage },
];
```

注意：文件中变量名含连字符（如 `ADMIN_ORDER-DETAIL`），是平台生成的合法写法。

---

## 设计规范

### 用户端（浅色暖调）

| 用途 | 色值 |
|------|------|
| 页面背景 | `#FFF8F0` |
| 主文字 / 深底 | `#370617` |
| 品牌强调橙 | `#E85D04` |
| 辅助绿 | `#606C38` |
| 次文字（50%） | `#370617]/50` |
| 边框（5%） | `#370617]/5` |
| 主字体 | Playfair Display（标题）/ DM Sans（正文） |
| 店铺名 | 味觉食堂 |

### 商家端（深色沉稳）

| 用途 | 色值 |
|------|------|
| 页面背景 | `#FAF3EC` |
| 主文字 / 深底 | `#1B1A16` |
| 品牌强调橙 | `#E85D04` |
| 状态-待处理 | `#FFB703` |
| 状态-备餐中 | `#FFB703` |
| 状态-已完成 | `#2A9D8F` |
| 主字体 | Noto Serif SC |
| 店铺名 | 老街食肆 |

**用户端与商家端视觉风格刻意区分**，修改时不可跨端混用色值。

---

## 数据模型

### 菜品（user side, 在 order.jsx 内）

```js
{
  id, name, price, rating, sales, image, desc, tag,
  category, specs: [{ label: '份量', options: ['标准份', '大份 +¥6'] }]
}
```
- `specs` 为规格数组，选项值中含 `+¥N` 格式表示加价项，加入购物车时解析加价
- `tag` 可能为空字符串，渲染时判空

### 购物车条目（order.jsx 内部 state）

```js
// key = `${menuId}__${specKey}` 或 `${menuId}`
{ menuId, name, price, quantity, image, specs: '标准份/微辣' }
```

### 商家端菜品（admin-menu.jsx 内）

```js
{ id, name, category, price, stock, sold, online: boolean, image, options: [{name, values:[]}] }
```

### 商家端订单状态机

```
pending (待处理) → cooking (备餐中) → done (已完成)
         ↓                        ↓
      cancelled (已取消)      cancelled (已取消)
```

---

## 已知问题与注意事项

1. **`orders.jsx` 和 `profile.jsx` 中有未使用的 `TabBarPlaceholder` 函数**，引用了未导入的 `UtensilsCrossed`、`ReceiptText` 图标；该函数从未被调用，属于死代码，可安全删除。
2. **`checkout.jsx` 使用硬编码 `MOCK_CART`**，而非从购物车 state 读取；当前是独立静态页面，无真实数据流。
3. **`admin-orders.jsx` 中部分 orders 的 items 缺少 `price` 字段**（如 id `A20260913-018`），admin-order-detail 展示时该条目价格会显示为 `¥undefined`。
4. **用户端与商家端菜品数据不共享**：order.jsx 的 MENU_DATA 与 admin-menu.jsx 的 MENU 是各自独立的 mock 常量，改一处不影响另一处。
5. **`detail.jsx` 底部购物车图标按钮无实际功能**，仅跳转回 order 页，不携带菜品信息。
6. **`specKey` 解析硬编码**：CartPanel.jsx 中将 specs 字符串按 `/` 分割并映射到 `['份量', '辣度', '温度', '糖度']`，新增规格维度时需同步更新此数组。
7. **`admin-orders.jsx` 中 `updateStatus` 操作后不会更新 `filtered`**，因为 `tab === 'all'` 时过滤条件是 `o.status !== 'cancelled'`，但 pending 标记完成后若筛选为 cooking 标签则订单会消失，符合业务预期。
