// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { UtensilsCrossed, ReceiptText, User } from 'lucide-react';

// 商家端底部导航栏
export function AdminTabBar({
  active,
  $w
}) {
  const tabs = [{
    id: 'admin-menu',
    label: '菜品',
    icon: UtensilsCrossed
  }, {
    id: 'admin-orders',
    label: '订单',
    icon: ReceiptText
  }, {
    id: 'admin-profile',
    label: '我的',
    icon: User
  }];
  return <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1B1A16]/95 backdrop-blur-md border-t border-[#E85D04]/15 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = tab.id === active;
        return <button key={tab.id} onClick={() => $w.utils.navigateTo({
          pageId: tab.id,
          params: {}
        })} className={`flex flex-col items-center gap-0.5 py-1.5 px-6 rounded-xl transition-all ${isActive ? 'text-[#E85D04]' : 'text-[#F7E1D7]/40'}`}>
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 1.8} />
              <span className={`text-[11px] ${isActive ? 'font-bold' : ''}`}>{tab.label}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-[#E85D04] mt-0.5" />}
            </button>;
      })}
      </div>
    </nav>;
}