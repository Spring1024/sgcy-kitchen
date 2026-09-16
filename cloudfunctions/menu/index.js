const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 把 cloud:// fileID 批量转成临时 HTTP URL，供 <image> 直接显示
async function resolveImages(dishes) {
  if (!dishes) return dishes;
  const list = Array.isArray(dishes) ? dishes : [dishes];
  const fileList = list
    .map(d => d.image)
    .filter(img => img && img.startsWith('cloud://'));
  if (fileList.length === 0) return dishes;

  const res = await cloud.getTempFileURL({ fileList });
  const map = {};
  (res.fileList || []).forEach(f => { map[f.fileID] = f.tempFileURL; });

  const patch = d => {
    if (d.image && map[d.image]) d.image = map[d.image];
    return d;
  };
  return Array.isArray(dishes) ? list.map(patch) : patch(list[0]);
}

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
      const dishes = await resolveImages(res.data);
      // 附带启用的分类列表
      const cats = await db.collection('categories')
        .where({ enabled: true })
        .orderBy('sort', 'asc')
        .limit(50)
        .get();
      return { dishes, categories: cats.data };
    }

    case 'categoryList': {
      const res = await db.collection('categories')
        .where({ enabled: true })
        .orderBy('sort', 'asc')
        .limit(50)
        .get();
      return res.data;
    }

    case 'detail': {
      const res = await db.collection('menus').doc(event.id).get();
      return await resolveImages(res.data);
    }

    case 'adminList': {
      await requireAdmin(OPENID);
      const res = await db.collection('menus').orderBy('createdAt', 'asc').limit(200).get();
      return await resolveImages(res.data);
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
