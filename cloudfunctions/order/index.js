const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

// 订阅消息模板
const TMPL_NEW_ORDER = 'FBhVZWl7Pxf5C-rBFp3CkhnGgVnthOveynOyb8EJL_U'; // thing6 订单内容, time7 下单时间, name8 联系人
const TMPL_CANCEL = '0rtvwdpSTuKQYk151Khi2H_v7W6n0HHsl4FAIfxRTpw';   // thing6 商品名称, time9 计划就餐时间

// 推送订阅消息给所有管理员
async function notifyAdmins(templateId, data) {
  try {
    const admins = await db.collection('users').where({ role: 'admin' }).limit(20).get();
    for (const admin of admins.data) {
      await cloud.openapi.subscribeMessage.send({
        touser: admin.openid,
        templateId,
        page: 'pages/admin/orders/index',
        data,
      }).catch(e => console.error('推送失败:', admin.openid, e.message));
    }
  } catch (e) {
    console.error('notifyAdmins error:', e);
  }
}

// 截取字段值（微信 thing 类型限 20 字）
function truncate(str, max = 20) {
  const s = String(str || '');
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

// 格式化时间为 "2026-09-18 12:30:00"
function formatDateTime(timeLabel) {
  if (!timeLabel) return '-';
  // timeLabel 可能是 "今天 12:30" 或 "09-20 18:00"
  const now = new Date();
  const year = now.getFullYear();
  const timeMatch = String(timeLabel).match(/(\d{1,2}):(\d{2})/);
  const timePart = timeMatch ? `${timeMatch[1].padStart(2,'0')}:${timeMatch[2]}:00` : '00:00:00';

  if (String(timeLabel).includes('今天')) {
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} ${timePart}`;
  }

  // 匹配 "09-20" 格式
  const dateMatch = String(timeLabel).match(/(\d{1,2})-(\d{1,2})/);
  if (dateMatch) {
    const month = String(dateMatch[1]).padStart(2, '0');
    const day = String(dateMatch[2]).padStart(2, '0');
    return `${year}-${month}-${day} ${timePart}`;
  }

  return `${year}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${timePart}`;
}

// 格式化时间为 "2026年9月18日 12:30"
function formatDateTimeCN(timeLabel) {
  if (!timeLabel) return '-';
  const dt = formatDateTime(timeLabel);
  // 从 "2026-09-18 12:30:00" 转为 "2026年9月18日 12:30"
  const m = dt.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2})/);
  if (m) return `${m[1]}年${parseInt(m[2])}月${parseInt(m[3])}日 ${m[4]}`;
  return dt;
}

async function requireAdmin(openid) {
  const res = await db.collection('users').where({ openid }).get();
  if (!res.data[0] || res.data[0].role !== 'admin') throw new Error('无权限');
}

async function getPointsPerYuan() {
  const res = await db.collection('shop_config').limit(1).get();
  return (res.data[0] && res.data[0].pointsPerYuan) || 10;
}

// 校验营业状态
async function checkShopOpen() {
  const res = await db.collection('shop_config').limit(1).get();
  const cfg = res.data[0];
  if (!cfg) return true; // 无配置时默认营业
  if (cfg.autoOpen !== false && cfg.openTime) {
    const match = String(cfg.openTime).match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (match) {
      const now = new Date();
      const cur = now.getHours() * 60 + now.getMinutes();
      const start = parseInt(match[1]) * 60 + parseInt(match[2]);
      const end = parseInt(match[3]) * 60 + parseInt(match[4]);
      return cur >= start && cur < end;
    }
  }
  return cfg.isOpen !== false;
}

exports.main = async (event) => {
  const { action } = event;
  const { OPENID } = cloud.getWXContext();

  switch (action) {
    case 'create': {
      const { items, type, timeLabel, remark, contactName, contactPhone } = event;
      if (!items || items.length === 0) return { error: '购物车为空' };

      // 校验营业状态
      const isOpen = await checkShopOpen();
      if (!isOpen) return { error: '已打烊，可私聊店长营业' };

      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const packagingFee = 0; // 不再收取打包费
      const total = subtotal;
      const pointsPerYuan = await getPointsPerYuan();
      const pointsEarned = Math.floor(total / pointsPerYuan);
      const orderId = 'ORD' + Date.now();

      const userRes = await db.collection('users').where({ openid: OPENID }).get();
      const user = userRes.data[0] || {};
      // 联系人：优先用户填写，否则用用户表昵称，最后为空
      const finalContactName = contactName || user.nickName || '';
      const finalContactPhone = contactPhone || user.phone || '';

      await db.collection('orders').add({
        data: {
          orderId, openid: OPENID, items,
          subtotal, packagingFee, total,
          type, timeLabel, remark,
          contactName: finalContactName,
          contactPhone: finalContactPhone,
          status: 'pending', pointsEarned,
          createdAt: db.serverDate(),
        },
      });

      // 推送新订单通知给管理员
      const dishSummary = items.map(i => `${i.name}×${i.quantity}`).join('、');
      await notifyAdmins(TMPL_NEW_ORDER, {
        thing6: { value: truncate(dishSummary) },
        time7: { value: formatDateTime(timeLabel) },
        name8: { value: truncate(finalContactName) },
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
      if (order.openid !== OPENID) {
        const u = await db.collection('users').where({ openid: OPENID }).get();
        if (!u.data[0] || u.data[0].role !== 'admin') return { error: '无权限' };
      }
      return order;
    }

    case 'cancel': {
      const res = await db.collection('orders').where({ orderId: event.orderId, openid: OPENID }).get();
      const order = res.data[0];
      if (!order) return { error: '订单不存在' };
      if (order.status !== 'pending') return { error: '当前状态不可取消' };
      await db.collection('orders').where({ orderId: event.orderId }).update({
        data: { status: 'cancelled' },
      });

      // 推送取消通知给管理员
      const dishSummary = order.items.map(i => `${i.name}×${i.quantity}`).join('、');
      await notifyAdmins(TMPL_CANCEL, {
        thing6: { value: truncate(dishSummary) },
        time9: { value: formatDateTimeCN(order.timeLabel) },
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

      // 关联查询用户昵称
      const openids = [...new Set(res.data.map(o => o.openid))];
      const usersRes = await db.collection('users')
        .where({ openid: _.in(openids) })
        .get();
      const userMap = {};
      usersRes.data.forEach(u => { userMap[u.openid] = u.nickName || ''; });

      return res.data.map(o => ({
        ...o,
        userNickName: userMap[o.openid] || '',
      }));
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
