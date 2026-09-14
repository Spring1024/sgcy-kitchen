// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Clock, ChefHat, CheckCircle2, XCircle, ArrowLeft, ReceiptText } from 'lucide-react';
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
    specs: ['辣度：中辣', '加面：否']
  }, {
    name: '丝袜奶茶',
    qty: 1,
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
    specs: ['辣度：特辣', '酸度：中酸']
  }, {
    name: '芒果西米露',
    qty: 1,
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
    specs: ['辣度：微辣', '黑椒：加量']
  }, {
    name: '古法酸梅汤',
    qty: 2
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
export default function AdminOrdersPage(props) {
  const {
    toast
  } = useToast();
  const [orders, setOrders] = useState(ALL_ORDERS);
  const [tab, setTab] = useState('all');
  const tabs = [{
    key: 'all',
    label: '全部'
  }, {
    key: 'pending',
    label: '待处理'
  }, {
    key: 'cooking',
    label: '备餐中'
  }, {
    key: 'done',
    label: '已完成'
  }];
  const filtered = orders.filter(o => tab === 'all' ? o.status !== 'cancelled' : o.status === tab);
  const updateStatus = (id, next) => {
    setOrders(prev => prev.map(o => o.id === id ? {
      ...o,
      status: next
    } : o));
    const label = next === 'done' ? '已标记完成' : next === 'cooking' ? '开始备餐' : '已取消';
    toast({
      title: '订单更新',
      description: `${id} ${label}`
    });
  };
  return <div className="min-h-screen bg-[#FAF3EC] font-['Noto_Serif_SC'] text-[#1B1A16] pb-24">
      <header className="bg-gradient-to-br from-[#1B1A16] to-[#370617] px-5 pt-12 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => props.$w.utils.navigateTo({
          pageId: 'admin-profile',
          params: {}
        })} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white font-bold text-lg">订单管理</h1>
            <p className="text-[#F7E1D7]/50 text-xs">到店订单 · 共 {orders.length} 单</p>
          </div>
        </div>
      </header>

      <main className="px-4 -mt-1 space-y-3">
        {/* 状态筛选 */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map(t => <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${tab === t.key ? 'bg-[#E85D04] text-white font-bold shadow-md shadow-[#E85D04]/20' : 'bg-white text-[#370617]/50'}`}>
              {t.label}
            </button>)}
        </div>

        {/* 订单列表 */}
        <div className="space-y-3">
          {filtered.length === 0 ? <div className="flex flex-col items-center justify-center py-16 text-center">
              <ReceiptText className="w-10 h-10 text-[#370617]/20 mb-3" />
              <p className="text-sm text-[#370617]/40">暂无相关订单</p>
            </div> : filtered.map(o => {
          const st = STATUS_MAP[o.status];
          const StIcon = st.icon;
          return <div key={o.id} onClick={() => props.$w.utils.navigateTo({
            pageId: 'admin-order-detail',
            params: {
              id: o.id
            }
          })} className="bg-white rounded-2xl p-4 shadow-sm border border-[#370617]/5 active:scale-[0.99] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${st.color} flex items-center gap-1`}>
                      <StIcon className="w-3 h-3" />
                      {st.text}
                    </span>
                    <span className="text-[11px] text-[#370617]/40">{o.typeText}</span>
                  </div>
                  <span className="text-xs text-[#370617]/40">{o.id}</span>
                </div>
                <div className="space-y-1 mb-3">
                  {o.items.map((it, i) => <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[#1B1A16]">{it.name}</span>
                      <span className="text-[#370617]/40">x{it.qty}</span>
                    </div>)}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#370617]/5">
                  <div>
                    <span className="text-[#E85D04] font-bold">¥{o.amount}</span>
                    <span className="text-[11px] text-[#370617]/30 ml-2">{o.phone}</span>
                  </div>
                  <div className="flex gap-2">
                    {o.status === 'pending' && <button onClick={() => updateStatus(o.id, 'cooking')} className="px-3 py-1.5 rounded-lg bg-[#FFB703] text-white text-xs font-bold active:scale-95 transition-all">
                        开始备餐
                      </button>}
                    {o.status === 'cooking' && <button onClick={() => updateStatus(o.id, 'done')} className="px-3 py-1.5 rounded-lg bg-[#2A9D8F] text-white text-xs font-bold active:scale-95 transition-all">
                        标记完成
                      </button>}
                    {o.status !== 'done' && o.status !== 'cancelled' && <button onClick={() => updateStatus(o.id, 'cancelled')} className="px-3 py-1.5 rounded-lg bg-[#370617]/5 text-[#370617]/50 text-xs font-bold active:scale-95 transition-all">
                        取消
                      </button>}
                  </div>
                </div>
              </div>;
        })}
        </div>
      </main>

      <AdminTabBar active="admin-orders" $w={props.$w} />
    </div>;
}