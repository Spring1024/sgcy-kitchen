const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 根据 openTime（如 "10:00 - 22:00"）计算当前是否营业
function calcIsOpen(openTime) {
  if (!openTime) return true;
  const match = String(openTime).match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!match) return true;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const start = parseInt(match[1]) * 60 + parseInt(match[2]);
  const end = parseInt(match[3]) * 60 + parseInt(match[4]);
  return cur >= start && cur < end;
}

exports.main = async (event) => {
  const { action } = event;
  const { OPENID } = cloud.getWXContext();

  switch (action) {
    case 'getConfig': {
      const res = await db.collection('shop_config').limit(1).get();
      const cfg = res.data[0] || null;
      if (!cfg) return null;
      // autoOpen 为 true 时，根据营业时间自动计算 isOpen
      if (cfg.autoOpen !== false) {
        cfg.isOpen = calcIsOpen(cfg.openTime);
      }
      return cfg;
    }

    case 'toggleOpen': {
      const u = await db.collection('users').where({ openid: OPENID }).get();
      if (!u.data[0] || u.data[0].role !== 'admin') return { error: '无权限' };
      const res = await db.collection('shop_config').limit(1).get();
      if (!res.data[0]) return { error: '配置不存在' };
      await db.collection('shop_config').doc(res.data[0]._id).update({
        data: {
          isOpen: !!event.isOpen,
          autoOpen: false,  // 手动切换后关闭自动判断
        },
      });
      return { success: true };
    }

    case 'setAuto': {
      // 恢复自动营业判断
      const u = await db.collection('users').where({ openid: OPENID }).get();
      if (!u.data[0] || u.data[0].role !== 'admin') return { error: '无权限' };
      const res = await db.collection('shop_config').limit(1).get();
      if (!res.data[0]) return { error: '配置不存在' };
      await db.collection('shop_config').doc(res.data[0]._id).update({
        data: { autoOpen: true },
      });
      return { success: true };
    }

    default:
      return { error: 'unknown action' };
  }
};
