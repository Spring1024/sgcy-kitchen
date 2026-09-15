const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

const APP_ID = 'wx3798d617f2e0bc80';
const APP_SECRET = 'edca4713ce251fd4e0d40b24b83043ef';

exports.main = async (event) => {
  const { action } = event;

  switch (action) {
    case 'login': {
      // 优先：小程序端传 code，用 code2session 换取 openid
      let openid;
      if (event.code) {
        const resp = await cloud.callContainer({
          config: { env: cloud.DYNAMIC_CURRENT_ENV },
          path: 'api.weixin.qq.com/sns/jscode2session',
          method: 'GET',
          header: {},
          query: {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: event.code,
            grant_type: 'authorization_code',
          },
        }).catch(() => null);

        if (resp && resp.data && resp.data.openid) {
          openid = resp.data.openid;
        }
      }

      // 兜底：云函数上下文自带 openid（无 AppSecret 也可工作）
      if (!openid) {
        openid = cloud.getWXContext().OPENID;
      }

      const res = await db.collection('users').where({ openid }).get();
      let userInfo;
      if (res.data.length === 0) {
        const addRes = await db.collection('users').add({
          data: {
            openid,
            nickName: '',
            avatarUrl: '',
            phone: '',
            points: 0,
            level: 1,
            role: 'user',
            createdAt: db.serverDate(),
          },
        });
        userInfo = { _id: addRes._id, openid, points: 0, level: 1, role: 'user' };
      } else {
        userInfo = res.data[0];
      }
      return { openid, userInfo };
    }

    case 'getUserInfo': {
      const { OPENID } = cloud.getWXContext();
      const res = await db.collection('users').where({ openid: OPENID }).get();
      return res.data[0] || null;
    }

    case 'updateProfile': {
      const { OPENID } = cloud.getWXContext();
      const { nickName, avatarUrl, phone } = event;
      const data = {};
      if (nickName !== undefined) data.nickName = nickName;
      if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;
      if (phone !== undefined) data.phone = phone;
      await db.collection('users').where({ openid: OPENID }).update({ data });
      return { success: true };
    }

    default:
      return { error: 'unknown action' };
  }
};
