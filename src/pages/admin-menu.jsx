// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Plus, Pencil, Power, PowerOff, Search, UtensilsCrossed, ArrowLeft } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

import { AdminTabBar } from '@/components/AdminTabBar';
import { DishFormModal } from '@/components/DishFormModal';
const MENU = [{
  id: 'm1',
  name: '红烧牛肉面',
  category: '招牌主食',
  price: 28,
  stock: 50,
  sold: 128,
  online: true,
  image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&q=80'
}, {
  id: 'm2',
  name: '蜜汁叉烧饭',
  category: '招牌主食',
  price: 26,
  stock: 40,
  sold: 96,
  online: true,
  image: 'https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=200&q=80'
}, {
  id: 'm3',
  name: '泰式冬阴功汤',
  category: '汤品',
  price: 32,
  stock: 0,
  sold: 54,
  online: false,
  image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=200&q=80'
}, {
  id: 'm4',
  name: '日式咖喱鸡排饭',
  category: '招牌主食',
  price: 28,
  stock: 35,
  sold: 87,
  online: true,
  image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200&q=80'
}, {
  id: 'm5',
  name: '黑椒牛柳',
  category: '热菜',
  price: 38,
  stock: 20,
  sold: 43,
  online: true,
  image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996?w=200&q=80'
}, {
  id: 'm6',
  name: '芒果西米露',
  category: '甜品',
  price: 16,
  stock: 60,
  sold: 210,
  online: true,
  image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80'
}];
export default function AdminMenuPage(props) {
  const {
    toast
  } = useToast();
  const [items, setItems] = useState(MENU);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const filtered = items.filter(i => i.name.includes(query) || i.category.includes(query));
  const onlineCount = items.filter(i => i.online).length;
  const toggleOnline = id => {
    setItems(prev => prev.map(i => i.id === id ? {
      ...i,
      online: !i.online
    } : i));
    const item = items.find(i => i.id === id);
    toast({
      title: '状态更新',
      description: `${item.name} 已${item.online ? '下架' : '上架'}`
    });
  };
  const saveEdit = e => {
    e.preventDefault();
    setItems(prev => prev.map(i => i.id === editing.id ? {
      ...i,
      name: editing.name,
      price: Number(editing.price),
      stock: Number(editing.stock)
    } : i));
    toast({
      title: '保存成功',
      description: `${editing.name} 信息已更新`
    });
    setEditing(null);
  };
  const handleSave = dish => {
    if (adding) {
      setItems(prev => [dish, ...prev]);
      toast({
        title: '创建成功',
        description: `${dish.name} 已添加到菜单`
      });
      setAdding(false);
    } else if (editing) {
      setItems(prev => prev.map(i => i.id === editing.id ? {
        ...i,
        ...dish
      } : i));
      toast({
        title: '保存成功',
        description: `${dish.name} 信息已更新`
      });
      setEditing(null);
    }
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
            <h1 className="text-white font-bold text-lg">菜品管理</h1>
            <p className="text-[#F7E1D7]/50 text-xs">在售 {onlineCount} / 共 {items.length} 道</p>
          </div>
        </div>
      </header>

      <main className="px-4 -mt-1 space-y-3">
        {/* 搜索 */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#370617]/30 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索菜品名称" className="w-full bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm border border-[#370617]/8 outline-none focus:border-[#E85D04] transition-colors" />
        </div>

        {/* 新增按钮 */}
        <button onClick={() => setAdding(true)} className="w-full bg-[#E85D04] rounded-xl py-3 flex items-center justify-center gap-2 text-white font-bold shadow-md shadow-[#E85D04]/20 active:scale-95 transition-all">
          <Plus className="w-4 h-4" />
          新增菜品
        </button>

        {/* 列表 */}
        <div className="space-y-2">
          {filtered.map(item => <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm border border-[#370617]/5 flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#1B1A16] truncate">{item.name}</h3>
                  {!item.online && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#370617]/10 text-[#370617]/50">已下架</span>}
                </div>
                <p className="text-[11px] text-[#370617]/40 mt-0.5">{item.category} · 库存 {item.stock} · 售 {item.sold}</p>
                <p className="text-[#E85D04] font-bold text-sm mt-1">¥{item.price}</p>
              </div>
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <button onClick={() => setEditing(item)} className="w-8 h-8 rounded-full bg-[#FFF8F0] flex items-center justify-center text-[#E85D04] active:scale-90 transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => toggleOnline(item.id)} className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-all ${item.online ? 'bg-[#370617]/5 text-[#370617]/40' : 'bg-[#2A9D8F]/10 text-[#2A9D8F]'}`}>
                  {item.online ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                </button>
              </div>
            </div>)}
        </div>
      </main>

      {/* 新增 / 编辑弹窗 */}
      {(adding || editing) && <DishFormModal initial={editing || undefined} onClose={() => {
      setAdding(false);
      setEditing(null);
    }} onSave={handleSave} />}

      <AdminTabBar active="admin-menu" $w={props.$w} />
    </div>;
}