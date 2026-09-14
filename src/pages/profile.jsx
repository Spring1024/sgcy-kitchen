// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, User, Phone, MapPin, Settings, Heart, Ticket, Star, ChevronRight, Store } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

import { TabBar } from '@/components/TabBar';
function TabBarPlaceholder() {
  return <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#370617]/8 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {[{
        id: 'order',
        label: '点餐',
        icon: UtensilsCrossed
      }, {
        id: 'orders',
        label: '订单',
        icon: ReceiptText
      }, {
        id: 'profile',
        label: '我的',
        icon: User
      }].map(tab => {
        const Icon = tab.icon;
        const isActive = tab.id === 'profile';
        return <button key={tab.id} className={`flex flex-col items-center gap-0.5 py-1.5 px-6 rounded-xl ${isActive ? 'text-[#E85D04]' : 'text-[#370617]/40'}`}>
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 1.8} />
              <span className={`text-[11px] ${isActive ? 'font-bold' : ''}`}>{tab.label}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-[#E85D04] mt-0.5" />}
            </button>;
      })}
      </div>
    </nav>;
}
export default function ProfilePage(props) {
  const {
    toast
  } = useToast();
  const user = props.$w?.auth?.currentUser;
  const nickName = user?.nickName || user?.name || '美食家';
  const avatarUrl = user?.avatarUrl || 'https://images.unsplash.com/photo-1633332755192-727a0d5340a3?w=200&h=200&fit=crop';
  const menuItems = [{
    icon: Heart,
    label: '我的收藏',
    desc: '12 道菜品'
  }, {
    icon: Ticket,
    label: '优惠券',
    desc: '3 张可用'
  }, {
    icon: Star,
    label: '我的评价',
    desc: '8 条评价'
  }, {
    icon: MapPin,
    label: '收货地址',
    desc: '北京市朝阳区建国路88号'
  }, {
    icon: Settings,
    label: '设置',
    desc: ''
  }];
  const adminEntry = {
    icon: Store,
    label: '商家端',
    desc: '切换至店铺管理后台'
  };
  const handleItem = label => {
    toast({
      title: label,
      description: '功能开发中，敬请期待',
      variant: 'default'
    });
  };
  return <div className="min-h-screen bg-[#FFF8F0] font-['DM_Sans'] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-[#370617]/5">
        <button onClick={() => props.$w?.utils?.navigateBack?.()} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-[#370617]/5 hover:shadow-md transition-shadow">
          <ArrowLeft className="w-5 h-5 text-[#370617]/70" />
        </button>
        <h1 className="font-['Playfair_Display'] text-lg font-bold text-[#370617]">个人中心</h1>
      </div>

      {/* Profile Header */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#E85D04] border-2 border-white flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </span>
          </div>
          <div className="flex-1">
            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#370617]">{nickName}</h2>
            <p className="text-sm text-[#370617]/50 mt-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              {user?.userId ? `ID: ${user.userId.slice(0, 8)}` : '未登录'}
            </p>
            <div className="flex gap-4 mt-3">
              <div>
                <span className="font-['Playfair_Display'] text-lg font-bold text-[#370617]">23</span>
                <span className="text-xs text-[#370617]/50 ml-1">订单</span>
              </div>
              <div>
                <span className="font-['Playfair_Display'] text-lg font-bold text-[#370617]">1280</span>
                <span className="text-xs text-[#370617]/50 ml-1">积分</span>
              </div>
              <div>
                <span className="font-['Playfair_Display'] text-lg font-bold text-[#370617]">Lv.4</span>
                <span className="text-xs text-[#370617]/50 ml-1">会员</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 space-y-2">
        {menuItems.map(item => {
        const Icon = item.icon;
        return <button key={item.label} onClick={() => handleItem(item.label)} className="w-full bg-white rounded-2xl p-4 border border-[#370617]/5 flex items-center gap-3 text-left hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#E85D04]/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#E85D04]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-[#370617]">{item.label}</span>
                {item.desc && <p className="text-xs text-[#370617]/40 mt-0.5">{item.desc}</p>}
              </div>
              <ChevronRight className="w-4 h-4 text-[#370617]/30 flex-shrink-0" />
            </button>;
      })}
        <button onClick={() => props.$w.utils.navigateTo({
        pageId: 'admin-menu',
        params: {}
      })} className="w-full bg-[#1B1A16] rounded-2xl p-4 border border-[#E85D04]/20 flex items-center gap-3 text-left hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-[#E85D04]/15 flex items-center justify-center flex-shrink-0">
            <Store className="w-5 h-5 text-[#E85D04]" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-bold text-white">{adminEntry.label}</span>
            <p className="text-xs text-[#F7E1D7]/50 mt-0.5">{adminEntry.desc}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#F7E1D7]/40 flex-shrink-0" />
        </button>
      </div>

      {/* Logout */}
      <div className="px-4 mt-4">
        <button onClick={() => toast({
        title: '已退出登录',
        description: '感谢使用味觉食堂',
        variant: 'default'
      })} className="w-full bg-white rounded-2xl py-3.5 border border-[#370617]/5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          退出登录
        </button>
      </div>

      {/* Bottom TabBar */}
      <TabBar active="profile" $w={props.$w} />
    </div>;
}