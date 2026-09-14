// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { UtensilsCrossed, ReceiptText, User } from 'lucide-react';

export function TabBar({
  active,
  $w
}) {
  const tabs = [{
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
  }];
  const handleNav = pageId => {
    if (pageId === active) return;
    $w?.utils?.navigateTo?.({
      pageId,
      params: {}
    });
  };
  return <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#370617]/8 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return <button key={tab.id} onClick={() => handleNav(tab.id)} className={`flex flex-col items-center gap-0.5 py-1.5 px-6 rounded-xl transition-all ${isActive ? 'text-[#E85D04]' : 'text-[#370617]/40 hover:text-[#370617]/60'}`}>
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.4 : 1.8} />
              <span className={`text-[11px] font-medium ${isActive ? 'font-bold' : ''}`}>{tab.label}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-[#E85D04] mt-0.5" />}
            </button>;
      })}
      </div>
    </nav>;
}