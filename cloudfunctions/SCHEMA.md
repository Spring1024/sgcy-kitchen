# 数据库 Schema

在 CloudBase 控制台创建以下 4 个集合。

## users

| 字段 | 类型 | 说明 |
|------|------|------|
| openid | string | 微信 openid，唯一索引 |
| nickName | string | 昵称 |
| avatarUrl | string | 头像 |
| phone | string | 手机号 |
| points | number | 积分余额 |
| level | number | 会员等级 |
| role | string | `user` / `admin` |
| createdAt | date | 创建时间 |

## menus

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 菜品名 |
| category | string | 分类名 |
| price | number | 基础价格（元） |
| stock | number | 库存 |
| sold | number | 已售数量 |
| online | bool | 是否上架 |
| image | string | 图片云存储 URL |
| desc | string | 描述 |
| tag | string | 标签（招牌/人气等） |
| specs | array | `[{label, options:[string]}]`，选项可含 `+¥N` 加价 |
| rating | number | 评分 |
| createdAt | date | |

索引：`category`、`online`

## orders

| 字段 | 类型 | 说明 |
|------|------|------|
| orderId | string | 订单号，唯一索引 |
| openid | string | 下单用户 |
| items | array | `[{menuId,name,price,quantity,image,specText}]` |
| subtotal | number | 商品小计 |
| packagingFee | number | 打包费 |
| total | number | 合计 |
| type | string | `today` / `reserve` |
| timeLabel | string | 到店时间描述 |
| remark | string | 备注 |
| status | string | `pending` / `cooking` / `done` / `cancelled` |
| pointsEarned | number | 完成后发放积分 |
| phone | string | 联系手机号 |
| createdAt | date | |

索引：`openid`、`status`、`createdAt`

状态机：`pending → cooking → done`，`pending/cooking → cancelled`

## shop_config（单条记录）

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 店铺名 |
| address | string | |
| phone | string | |
| openTime | string | 如 "10:00 - 22:00" |
| isOpen | bool | 是否营业 |
| rating | number | |
| pointsPerYuan | number | 积分规则：每多少元积 1 分，默认 10 |
