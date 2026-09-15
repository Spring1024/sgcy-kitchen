const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { action } = event;
  const { OPENID } = cloud.getWXContext();

  switch (action) {
    case 'getConfig': {
      const res = await db.collection('shop_config').limit(1).get();
      return res.data[0] || null;
    }

    case 'toggleOpen': {
      // 校验管理员
      const u = await db.collection('users').where({ openid: OPENID }).get();
      if (!u.data[0] || u.data[0].role !== 'admin') return { error: '无权限' };
      const res = await db.collection('shop_config').limit(1).get();
      if (!res.data[0]) return { error: '配置不存在' };
      await db.collection('shop_config').doc(res.data[0]._id).update({
        data: { isOpen: !!event.isOpen },
      });
      return { success: true };
    }

    default:
      return { error: 'unknown action' };
  }
};
