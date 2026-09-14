// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Store, Phone, MapPin, Power, PowerOff, User, ArrowRight, LogOut, Bell, Star, TrendingUp } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

import { AdminTabBar } from '@/components/AdminTabBar';
export default function AdminProfilePage(props) {
  const {
    toast
  } = useToast();
  const [open, setOpen] = useState(true);
  const toggleOpen = () => {
    setOpen(prev => !prev);
    toast({
      title: '营业状态',
      description: !open ? '店铺已营业' : '店铺已打烊'
    });
  };
  const switchToUser = () => {
    props.$w.utils.redirectTo({
      pageId: 'order',
      params: {}
    });
    toast({
      title: '已切换',
      description: '已进入用户端'
    });
  };
  return <div className="min-h-screen bg-[#FAF3EC] font-['Noto_Serif_SC'] text-[#1B1A16] pb-24">
      <header className="bg-gradient-to-br from-[#1B1A16] to-[#370617] px-5 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#E85D04] flex items-center justify-center shadow-lg shadow-[#E85D04]/30 flex-shrink-0">
            <Store className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-lg">老街食肆</h1>
            <p className="text-[#F7E1D7]/50 text-xs mt-0.5">商家账号 · 138****6688</p>
          </div>
          <button onClick={toggleOpen} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${open ? 'bg-[#2A9D8F]/20 text-[#2A9D8F]' : 'bg-[#370617]/30 text-[#F7E1D7]/50'}`}>
            {open ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
            {open ? '营业中' : '已打烊'}
          </button>
        </div>
      </header>

      <main className="px-4 -mt-2 space-y-3">
        {/* 店铺数据 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#370617]/5 text-center">
            <TrendingUp className="w-5 h-5 text-[#E85D04] mx-auto mb-1" />
            <p className="font-['Playfair_Display'] text-xl font-bold text-[#1B1A16]">¥134</p>
            <span className="text-[11px] text-[#370617]/40">今日营收</span>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#370617]/5 text-center">
            <Star className="w-5 h-5 text-[#E85D04] mx-auto mb-1" />
            <p className="font-['Playfair_Display'] text-xl font-bold text-[#1B1A16]">4.8</p>
            <span className="text-[11px] text-[#370617]/40">店铺评分</span>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#370617]/5 text-center">
            <User className="w-5 h-5 text-[#E85D04] mx-auto mb-1" />
            <p className="font-['Playfair_Display'] text-xl font-bold text-[#1B1A16]">6</p>
            <span className="text-[11px] text-[#370617]/40">在售菜品</span>
          </div>
        </div>

        {/* 店铺信息 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#370617]/5 space-y-3">
          <h2 className="text-sm font-bold text-[#1B1A16]">店铺信息</h2>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-[#E85D04] flex-shrink-0" />
            <span className="text-[#370617]/70">138 0013 6688</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-[#E85D04] flex-shrink-0" />
            <span className="text-[#370617]/70">北京市朝阳区建国路88号 · 老街食肆</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Bell className="w-4 h-4 text-[#E85D04] flex-shrink-0" />
            <span className="text-[#370617]/70">新订单提醒已开启</span>
          </div>
        </div>

        {/* 切换用户端 */}
        <button onClick={switchToUser} className="w-full bg-[#E85D04] rounded-2xl p-4 flex items-center justify-between shadow-md shadow-[#E85D04]/20 active:scale-95 transition-all">
          <div className="flex items-center gap-2 text-white">
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm">切换至用户端</span>
          </div>
          <ArrowRight className="w-4 h-4 text-white/70" />
        </button>

        <button onClick={() => toast({
        title: '提示',
        description: '退出登录功能开发中'
      })} className="w-full bg-white rounded-2xl p-4 flex items-center justify-center gap-2 text-[#370617]/40 text-sm font-medium border border-[#370617]/5">
          <LogOut className="w-4 h-4" />
          退出商家账号
        </button>
      </main>

      <AdminTabBar active="admin-profile" $w={props.$w} />
    </div>;
}