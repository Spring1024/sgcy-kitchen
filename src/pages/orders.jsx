// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, Store, Clock, ChevronRight, ReceiptText } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

import { TabBar } from '@/components/TabBar';
const ORDERS = [{
  id: 'ORD20260912001',
  status: 'completed',
  statusText: '已完成',
  type: 'today',
  time: '今天 12:30',
  items: [{
    name: '秘制红烧牛腩面',
    price: 38,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop' },
  {
    name: '冰镇酸梅汤',
    price: 12,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop' }],

  total: 62 },
{
  id: 'ORD20260910002',
  status: 'completed',
  statusText: '已完成',
  type: 'reserve',
  time: '09-10 18:00',
  items: [{
    name: '金牌叉烧饭',
    price: 42,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=400&fit=crop' },
  {
    name: '杨枝甘露',
    price: 22,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=400&fit=crop' }],

  total: 64 },
{
  id: 'ORD20260908003',
  status: 'cancelled',
  statusText: '已取消',
  type: 'today',
  time: '09-08 19:15',
  items: [{
    name: '咖喱鸡排饭',
    price: 35,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=400&fit=crop' }],

  total: 35 }];

function TabBarPlaceholder() {
  return <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#370617]/8 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {[{
        id: 'order',
        label: '点餐',
        icon: UtensilsCrossed },
      {
        id: 'orders',
        label: '订单',
        icon: ReceiptText },
      {
        id: 'profile',
        label: '我的',
        icon: User }].
      map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === 'orders';
        return <button key={tab.id} className={`flex flex-col items-center gap-0.5 py-1.5 px-6 rounded-xl ${isActive ? 'text-[#E85D04]' : 'text-[#370617]/40'}`}>
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 1.8} />
              <span className={`text-[11px] ${isActive ? 'font-bold' : ''}`}>{tab.label}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-[#E85D04] mt-0.5" />}
            </button>;
      })}
      </div>
    </nav>;
}
export default function OrdersPage(props) {
  const {
    toast } =
  useToast();
  const [filter, setFilter] = useState('all');
  const tabs = [{
    id: 'all',
    label: '全部' },
  {
    id: 'today',
    label: '当天' },
  {
    id: 'reserve',
    label: '预约' },
  {
    id: 'completed',
    label: '已完成' }];

  const filtered = ORDERS.filter((o) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return o.status === 'completed';
    return o.type === filter;
  });
  const handleDetail = (id) => {
    toast({
      title: '订单详情',
      description: `查看订单 ${id}`,
      variant: 'default' });

  };
  return <div className="min-h-screen bg-[#FFF8F0] font-['DM_Sans'] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-[#370617]/5">
        <button onClick={() => props.$w?.utils?.navigateBack?.()} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-[#370617]/5 hover:shadow-md transition-shadow">
          <ArrowLeft className="w-5 h-5 text-[#370617]/70" />
        </button>
        <h1 className="font-['Playfair_Display'] text-lg font-bold text-[#370617]">我的订单</h1>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-[57px] z-20 bg-[#FFF8F0]/95 backdrop-blur-md px-4 py-2 flex gap-2 border-b border-[#370617]/5">
        {tabs.map((t) => {})}


      </div>

      {/* Orders List */}
      <div className="px-4 pt-4 space-y-3">
        {filtered.length === 0 ? <div className="flex flex-col items-center justify-center pt-24 text-center">
            <div className="w-16 h-16 rounded-full bg-[#370617]/5 flex items-center justify-center mb-4">
              <ReceiptText className="w-7 h-7 text-[#370617]/30" />
            </div>
            <p className="text-[#370617]/50 text-sm">暂无相关订单</p>
          </div> : filtered.map((order) => <div key={order.id} className="bg-white rounded-2xl p-4 border border-[#370617]/5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#E85D04]" />
                  <span className="font-['Playfair_Display'] text-sm font-bold text-[#370617]">味觉食堂</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#606C38]/10 text-[#606C38] font-medium">
                    {order.type === 'today' ? '当天' : '预约'}
                  </span>
                </div>
                <span className={`text-xs font-medium ${order.status === 'cancelled' ? 'text-[#370617]/40' : 'text-[#E85D04]'}`}>
                  {order.statusText}
                </span>
              </div>

              {/* Items preview */}
              <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
                {order.items.map((it, i) => <div key={i} className="flex items-center gap-2 bg-[#FFF8F0] rounded-xl p-2 flex-shrink-0">
                    <img src={it.image} alt={it.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-bold text-[#370617] truncate w-24">{it.name}</p>
                      <p className="text-[11px] text-[#E85D04] font-medium">×{it.quantity}</p>
                    </div>
                  </div>)}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#370617]/5">
                <span className="text-xs text-[#370617]/50 flex items-center gap-1">
                  <Clock className="w-3 h-3" />{order.time}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#370617]/60">
                    合计 <span className="font-['Playfair_Display'] text-base font-bold text-[#E85D04]">¥{order.total}</span>
                  </span>
                  <button onClick={() => handleDetail(order.id)} className="flex items-center gap-1 text-xs text-[#370617]/50 hover:text-[#E85D04] transition-colors">
                    详情
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>)}
      </div>

      {/* Bottom TabBar */}
      <TabBar active="orders" $w={props.$w} />
    </div>;
}