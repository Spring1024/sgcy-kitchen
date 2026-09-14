// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, Clock, ChefHat, CheckCircle2, XCircle, Phone, Store, ReceiptText, User } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

import { AdminTabBar } from '@/components/AdminTabBar';
const ALL_ORDERS = [{
  id: 'A20260914-001',
  type: '当天',
  typeText: '到店 · 今天',
  items: [{
    name: '红烧牛肉面',
    qty: 1,
    price: 28,
    specs: ['辣度：中辣', '加面：否']
  }, {
    name: '丝袜奶茶',
    qty: 1,
    price: 5,
    specs: ['糖度：半糖', '温度：热']
  }],
  amount: 33,
  status: 'pending',
  time: '12:30',
  phone: '138****6688'
}, {
  id: 'A20260914-002',
  type: '预约',
  typeText: '到店 · 09-15 18:00',
  items: [{
    name: '日式咖喱鸡排饭',
    qty: 2,
    price: 28,
    specs: ['辣度：不辣', '加蛋：双蛋']
  }],
  amount: 56,
  status: 'cooking',
  time: '预约',
  phone: '139****2233'
}, {
  id: 'A20260914-003',
  type: '当天',
  typeText: '到店 · 今天',
  items: [{
    name: '酸菜鱼片',
    qty: 1,
    price: 38,
    specs: ['辣度：特辣', '酸度：中酸']
  }, {
    name: '芒果西米露',
    qty: 1,
    price: 7,
    specs: ['糖度：少糖', '温度：冰']
  }],
  amount: 45,
  status: 'done',
  time: '11:15',
  phone: '137****9911'
}, {
  id: 'A20260913-018',
  type: '当天',
  typeText: '到店 · 昨天',
  items: [{
    name: '黑椒牛柳',
    qty: 1,
    price: 36,
    specs: ['辣度：微辣', '黑椒：加量']
  }, {
    name: '古法酸梅汤',
    qty: 2,
    price: 8,
    specs: ['酸度：偏酸', '糖度：正常糖']
  }],
  amount: 52,
  status: 'done',
  time: '19:42',
  phone: '135****4455'
}];
const STATUS_MAP = {
  pending: {
    text: '待处理',
    color: 'bg-[#E85D04]/10 text-[#E85D04]',
    icon: Clock
  },
  cooking: {
    text: '备餐中',
    color: 'bg-[#FFB703]/15 text-[#FFB703]',
    icon: ChefHat
  },
  done: {
    text: '已完成',
    color: 'bg-[#2A9D8F]/10 text-[#2A9D8F]',
    icon: CheckCircle2
  },
  cancelled: {
    text: '已取消',
    color: 'bg-[#370617]/10 text-[#370617]/40',
    icon: XCircle
  }
};
export default function AdminOrderDetailPage(props) {
  const {
    toast
  } = useToast();
  const orderId = props.$w.page.dataset.params.id;
  const [order, setOrder] = useState(() => ALL_ORDERS.find(o => o.id === orderId) || null);
  const updateStatus = next => {
    if (!order) return;
    setOrder(prev => ({
      ...prev,
      status: next
    }));
    const label = next === 'done' ? '已标记完成' : next === 'cooking' ? '开始备餐' : '已取消';
    toast({
      title: '订单更新',
      description: `${order.id} ${label}`
    });
  };
  const goBack = () => {
    props.$w.utils.navigateTo({
      pageId: 'admin-orders',
      params: {}
    });
  };
  if (!order) {
    return <div className="min-h-screen bg-[#FAF3EC] font-['Noto_Serif_SC'] text-[#1B1A16] flex flex-col items-center justify-center gap-4">
        <ReceiptText className="w-12 h-12 text-[#370617]/20" />
        <p className="text-sm text-[#370617]/40">未找到订单 {orderId}</p>
        <button onClick={goBack} className="px-5 py-2.5 rounded-xl bg-[#E85D04] text-white text-sm font-bold active:scale-95 transition-all">
          返回订单列表
        </button>
      </div>;
  }
  const st = STATUS_MAP[order.status];
  const StIcon = st.icon;
  return <div className="min-h-screen bg-[#FAF3EC] font-['Noto_Serif_SC'] text-[#1B1A16] pb-28">
      <header className="bg-gradient-to-br from-[#1B1A16] to-[#370617] px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={goBack} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg">订单详情</h1>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#F7E1D7]/50 text-xs mb-1">订单号</p>
            <p className="text-white font-bold text-base tracking-wide">{order.id}</p>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 ${st.color}`}>
            <StIcon className="w-3.5 h-3.5" />
            {st.text}
          </span>
        </div>
      </header>

      <main className="px-4 -mt-3 space-y-3">
        {/* 取餐与联系信息 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#370617]/5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E85D04]/10 flex items-center justify-center">
              <Store className="w-4 h-4 text-[#E85D04]" />
            </div>
            <div>
              <p className="text-xs text-[#370617]/40">取餐方式</p>
              <p className="text-sm font-bold text-[#1B1A16]">{order.typeText}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2A9D8F]/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#2A9D8F]" />
            </div>
            <div>
              <p className="text-xs text-[#370617]/40">下单时间</p>
              <p className="text-sm font-bold text-[#1B1A16]">{order.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFB703]/15 flex items-center justify-center">
              <Phone className="w-4 h-4 text-[#FFB703]" />
            </div>
            <div>
              <p className="text-xs text-[#370617]/40">联系顾客</p>
              <p className="text-sm font-bold text-[#1B1A16]">{order.phone}</p>
            </div>
          </div>
        </div>

        {/* 菜品明细 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#370617]/5">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-[#370617]/40" />
            <h2 className="text-sm font-bold text-[#1B1A16]">菜品明细</h2>
          </div>
          <div className="space-y-4">
            {order.items.map((it, i) => <div key={i} className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-[#FAF3EC] text-[#E85D04] text-xs font-bold flex items-center justify-center mt-0.5">{it.qty}</span>
                  <div className="min-w-0">
                    <span className="text-sm text-[#1B1A16] font-medium block truncate">{it.name}</span>
                    {Array.isArray(it.specs) && it.specs.length > 0 && <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {it.specs.map((s, si) => <span key={si} className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF3EC] text-[#370617]/55 border border-[#370617]/8">{s}</span>)}
                      </div>}
                  </div>
                </div>
                <span className="text-sm text-[#370617]/50 shrink-0">¥{it.price * it.qty}</span>
              </div>)}
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#370617]/5">
            <span className="text-xs text-[#370617]/40">共 {order.items.reduce((s, it) => s + it.qty, 0)} 件</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-[#370617]/40">合计</span>
              <span className="text-lg font-bold text-[#E85D04]">¥{order.amount}</span>
            </div>
          </div>
        </div>
      </main>

      {/* 底部操作栏 */}
      {order.status !== 'cancelled' && <div className="fixed bottom-16 left-0 right-0 z-40 px-4 py-3 bg-[#FAF3EC]/95 backdrop-blur-md border-t border-[#370617]/5">
          <div className="flex gap-2">
            {order.status === 'pending' && <button onClick={() => updateStatus('cooking')} className="flex-1 py-3 rounded-xl bg-[#FFB703] text-white font-bold shadow-md shadow-[#FFB703]/20 active:scale-95 transition-all">
                开始备餐
              </button>}
            {order.status === 'cooking' && <button onClick={() => updateStatus('done')} className="flex-1 py-3 rounded-xl bg-[#2A9D8F] text-white font-bold shadow-md shadow-[#2A9D8F]/20 active:scale-95 transition-all">
                标记完成
              </button>}
            {order.status !== 'done' && <button onClick={() => updateStatus('cancelled')} className="px-5 py-3 rounded-xl bg-[#370617]/5 text-[#370617]/50 font-bold active:scale-95 transition-all">
                取消订单
              </button>}
          </div>
        </div>}

      <AdminTabBar active="admin-orders" $w={props.$w} />
    </div>;
}