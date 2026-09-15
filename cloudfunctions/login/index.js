const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { action } = event;

  switch (action) {
    case 'login': {
      // 方式一：直接用云函数上下文自带的 OPENID（推荐，无需 AppSecret）
      // 小程序端调用 wx.cloud.callFunction 时，云函数自动能获取用户 openid
      const { OPENID } = cloud.getWXContext();
      const openid = OPENID;

      if (!openid) {
        return { error: '无法获取 openid' };
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
