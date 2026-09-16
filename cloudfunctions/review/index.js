const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { action } = event;
  const { OPENID } = cloud.getWXContext();

  switch (action) {
    // 用户创建评价
    case 'create': {
      const { orderId, menuId, dishName, rating, content, tags } = event;
      if (!orderId || !dishName) return { error: '缺少必要字段' };
      const r = Number(rating) || 5;
      const data = {
        openid: OPENID,
        orderId,
        menuId,
        dishName,
        rating: r,
        content: (content || '').slice(0, 500),
        tags: Array.isArray(tags) ? tags : [],
        createdAt: db.serverDate(),
      };
      const res = await db.collection('reviews').add({ data });
      return { _id: res._id };
    }

    // 我的评价列表
    case 'myList': {
      const res = await db.collection('reviews')
        .where({ openid: OPENID })
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
      return res.data;
    }

    // 全部评价列表（管理员/店铺）
    case 'list': {
      const { menuId } = event;
      const where = {};
      if (menuId) where.menuId = menuId;
      const res = await db.collection('reviews')
        .where(where)
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get();
      return res.data;
    }

    default:
      return { error: 'unknown action' };
  }
};
