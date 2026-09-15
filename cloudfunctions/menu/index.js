const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

async function requireAdmin(openid) {
  const res = await db.collection('users').where({ openid }).get();
  if (!res.data[0] || res.data[0].role !== 'admin') {
    throw new Error('无权限');
  }
}

exports.main = async (event) => {
  const { action } = event;
  const { OPENID } = cloud.getWXContext();

  switch (action) {
    case 'list': {
      const res = await db.collection('menus')
        .where({ online: true })
        .orderBy('createdAt', 'asc')
        .limit(100)
        .get();
      return res.data;
    }

    case 'detail': {
      const res = await db.collection('menus').doc(event.id).get();
      return res.data;
    }

    case 'adminList': {
      await requireAdmin(OPENID);
      const res = await db.collection('menus').orderBy('createdAt', 'asc').limit(200).get();
      return res.data;
    }

    case 'save': {
      await requireAdmin(OPENID);
      const { _id, ...data } = event.dish;
      if (_id) {
        await db.collection('menus').doc(_id).update({ data });
        return { _id };
      }
      data.createdAt = db.serverDate();
      data.sold = data.sold || 0;
      data.online = data.online !== false;
      const res = await db.collection('menus').add({ data });
      return { _id: res._id };
    }

    case 'toggle': {
      await requireAdmin(OPENID);
      await db.collection('menus').doc(event.id).update({
        data: { online: !!event.online },
      });
      return { success: true };
    }

    case 'delete': {
      await requireAdmin(OPENID);
      await db.collection('menus').doc(event.id).remove();
      return { success: true };
    }

    default:
      return { error: 'unknown action' };
  }
};
