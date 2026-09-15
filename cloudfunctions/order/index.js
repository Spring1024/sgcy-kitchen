const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

async function requireAdmin(openid) {
  const res = await db.collection('users').where({ openid }).get();
  if (!res.data[0] || res.data[0].role !== 'admin') throw new Error('无权限');
}

// 获取积分规则
async function getPointsPerYuan() {
  const res = await db.collection('shop_config').limit(1).get();
  return (res.data[0] && res.data[0].pointsPerYuan) || 10;
}

exports.main = async (event) => {
  const { action } = event;
  const { OPENID } = cloud.getWXContext();

  switch (action) {
    case 'create': {
      const { items, type, timeLabel, remark } = event;
      if (!items || items.length === 0) return { error: '购物车为空' };

      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const packagingFee = items.length;
      const total = subtotal + packagingFee;
      const pointsPerYuan = await getPointsPerYuan();
      const pointsEarned = Math.floor(total / pointsPerYuan);
      const orderId = 'ORD' + Date.now();

      const userRes = await db.collection('users').where({ openid: OPENID }).get();
      const phone = (userRes.data[0] && userRes.data[0].phone) || '';

      await db.collection('orders').add({
        data: {
          orderId, openid: OPENID, items,
          subtotal, packagingFee, total,
          type, timeLabel, remark,
          status: 'pending', pointsEarned, phone,
          createdAt: db.serverDate(),
        },
      });
      return { orderId, total, pointsEarned };
    }

    case 'list': {
      const { status, page = 0, pageSize = 20 } = event;
      const where = { openid: OPENID };
      if (status && status !== 'all') {
        if (status === 'active') {
          where.status = _.in(['pending', 'cooking']);
        } else {
          where.status = status;
        }
      }
      const res = await db.collection('orders')
        .where(where)
        .orderBy('createdAt', 'desc')
        .skip(page * pageSize)
        .limit(pageSize)
        .get();
      return res.data;
    }

    case 'detail': {
      const res = await db.collection('orders').where({ orderId: event.orderId }).get();
      const order = res.data[0];
      if (!order) return { error: '订单不存在' };
      // 只允许本人或管理员查看
      if (order.openid !== OPENID) {
        const u = await db.collection('users').where({ openid: OPENID }).get();
        if (!u.data[0] || u.data[0].role !== 'admin') return { error: '无权限' };
      }
      return order;
    }

    case 'cancel': {
      // 用户取消自己的待处理订单
      const res = await db.collection('orders').where({ orderId: event.orderId, openid: OPENID }).get();
      const order = res.data[0];
      if (!order) return { error: '订单不存在' };
      if (order.status !== 'pending') return { error: '当前状态不可取消' };
      await db.collection('orders').where({ orderId: event.orderId }).update({
        data: { status: 'cancelled' },
      });
      return { success: true };
    }

    // ---- 商家端 ----
    case 'adminList': {
      await requireAdmin(OPENID);
      const { status, page = 0, pageSize = 50 } = event;
      const where = {};
      if (status && status !== 'all') where.status = status;
      const res = await db.collection('orders')
        .where(where)
        .orderBy('createdAt', 'desc')
        .skip(page * pageSize)
        .limit(pageSize)
        .get();
      return res.data;
    }

    case 'update': {
      await requireAdmin(OPENID);
      const { orderId, status } = event;
      const valid = ['pending', 'cooking', 'done', 'cancelled'];
      if (!valid.includes(status)) return { error: '非法状态' };

      const res = await db.collection('orders').where({ orderId }).get();
      const order = res.data[0];
      if (!order) return { error: '订单不存在' };

      await db.collection('orders').where({ orderId }).update({ data: { status } });

      // 积分发放：首次变为 done 时
      if (status === 'done' && order.status !== 'done' && order.pointsEarned > 0) {
        await db.collection('users').where({ openid: order.openid }).update({
          data: { points: _.inc(order.pointsEarned) },
        });
      }
      return { success: true };
    }

    default:
      return { error: 'unknown action' };
  }
};
