// 数据库初始化脚本（在 CloudBase 控制台的"数据库"->"云函数调试"中执行一次，或部署后手动执行）
// 创建集合：users、menus、orders、shop_config
// 并向 shop_config 写入一条初始记录，向 menus 写入示例菜品

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async () => {
  // shop_config 初始化
  const cfg = await db.collection('shop_config').limit(1).get();
  if (cfg.data.length === 0) {
    await db.collection('shop_config').add({
      data: {
        name: '味觉食堂',
        address: '北京市朝阳区建国路88号',
        phone: '138 0013 6688',
        openTime: '10:00 - 22:00',
        isOpen: true,
        rating: 4.8,
        pointsPerYuan: 10,
        createdAt: db.serverDate(),
      },
    });
  }

  // 示例菜品
  const cnt = await db.collection('menus').count();
  if (cnt.total === 0) {
    const samples = [
      { name: '秘制红烧牛腩面', category: '招牌推荐', price: 38, stock: 50, sold: 286, online: true, tag: '招牌', rating: 4.9,
        image: 'cloud://demo/beef-noodle.jpg',
        desc: '慢炖6小时的牛腩，搭配手工拉面',
        specs: [{ label: '份量', options: ['标准份', '大份 +¥6'] }, { label: '辣度', options: ['微辣', '中辣', '特辣'] }] },
      { name: '金牌叉烧饭', category: '招牌推荐', price: 42, stock: 40, sold: 213, online: true, tag: '人气', rating: 4.8,
        image: 'cloud://demo/pork-rice.jpg',
        desc: '蜜汁叉烧配溏心蛋',
        specs: [{ label: '份量', options: ['标准份', '加饭 +¥3'] }] },
      { name: '番茄牛腩面', category: '粉面系列', price: 32, stock: 30, sold: 159, online: true, rating: 4.6,
        image: 'cloud://demo/tomato-noodle.jpg',
        desc: '新鲜番茄熬制汤底',
        specs: [{ label: '份量', options: ['标准份', '大份 +¥5'] }] },
      { name: '咖喱鸡排饭', category: '米饭套餐', price: 35, stock: 35, sold: 225, online: true, rating: 4.7,
        image: 'cloud://demo/curry-rice.jpg',
        desc: '日式咖喱配酥脆鸡排',
        specs: [{ label: '份量', options: ['标准份', '大份 +¥5'] }] },
      { name: '鲜肉锅贴', category: '小吃甜品', price: 18, stock: 60, sold: 312, online: true, rating: 4.5,
        image: 'cloud://demo/dumpling.jpg',
        desc: '底部焦脆，鲜嫩多汁',
        specs: [{ label: '份量', options: ['6个', '12个 +¥12'] }] },
      { name: '冰镇酸梅汤', category: '饮品', price: 12, stock: 100, sold: 356, online: true, rating: 4.4,
        image: 'cloud://demo/plum-juice.jpg',
        desc: '古法熬制，酸甜解暑',
        specs: [{ label: '温度', options: ['冰镇', '常温'] }] },
    ];
    for (const s of samples) {
      await db.collection('menus').add({ data: { ...s, createdAt: db.serverDate() } });
    }
  }

  return { success: true };
};
