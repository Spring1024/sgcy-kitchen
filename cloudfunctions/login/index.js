const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { action } = event;

  switch (action) {
    case 'login': {
      // 优先从小程序上下文获取 openid
      let openid = cloud.getWXContext().OPENID;

      // 云端测试时允许传入模拟 openid
      if (!openid && event.testOpenid) {
        openid = event.testOpenid;
      }

      if (!openid) {
        return { error: '无法获取 openid，请在小程序端调用或传入 testOpenid 测试' };
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
