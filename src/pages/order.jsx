// @ts-ignore;
import React, { useState, useMemo } from 'react';
// @ts-ignore;
import { ShoppingCart, Plus, Minus, X, Search, ChefHat, Clock, Star } from 'lucide-react';

import { CategoryBar } from '@/components/CategoryBar';
import { MenuItem } from '@/components/MenuItem';
import { CartPanel } from '@/components/CartPanel';
import { TabBar } from '@/components/TabBar';
import { SpecModal } from '@/components/SpecModal';
const MENU_DATA = [{
  id: 'cat1',
  name: '招牌推荐',
  icon: '🔥',
  items: [{
    id: 'm1',
    name: '秘制红烧牛腩面',
    price: 38,
    rating: 4.9,
    sales: 286,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop',
    desc: '慢炖6小时的牛腩，搭配手工拉面',
    tag: '招牌',
    specs: [{
      label: '份量',
      options: ['标准份', '大份 +¥6']
    }, {
      label: '辣度',
      options: ['微辣', '中辣', '特辣']
    }]
  }, {
    id: 'm2',
    name: '金牌叉烧饭',
    price: 42,
    rating: 4.8,
    sales: 213,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=400&fit=crop',
    desc: '蜜汁叉烧配溏心蛋',
    tag: '人气',
    specs: [{
      label: '份量',
      options: ['标准份', '加饭 +¥3']
    }]
  }, {
    id: 'm3',
    name: '海鲜叻沙汤面',
    price: 48,
    rating: 4.7,
    sales: 178,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de3b540?w=500&h=400&fit=crop',
    desc: '浓郁椰浆汤底配鲜虾鱿鱼',
    tag: '主厨推荐',
    specs: [{
      label: '辣度',
      options: ['微辣', '中辣']
    }]
  }]
}, {
  id: 'cat2',
  name: '粉面系列',
  icon: '🍜',
  items: [{
    id: 'm4',
    name: '番茄牛腩面',
    price: 32,
    rating: 4.6,
    sales: 159,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&h=400&fit=crop',
    desc: '新鲜番茄熬制汤底',
    specs: [{
      label: '份量',
      options: ['标准份', '大份 +¥5']
    }]
  }, {
    id: 'm5',
    name: '酸菜鱼片面',
    price: 36,
    rating: 4.5,
    sales: 142,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop',
    desc: '老坛酸菜配嫩滑鱼片',
    specs: [{
      label: '辣度',
      options: ['微辣', '中辣', '特辣']
    }]
  }, {
    id: 'm6',
    name: '葱油拌面',
    price: 22,
    rating: 4.4,
    sales: 198,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de3b540?w=500&h=400&fit=crop',
    desc: '上海经典葱油拌面',
    specs: [{
      label: '份量',
      options: ['标准份', '大份 +¥4']
    }]
  }, {
    id: 'm7',
    name: '麻辣肥牛米线',
    price: 35,
    rating: 4.6,
    sales: 167,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=400&fit=crop',
    desc: '麻辣鲜香，肥牛嫩滑',
    specs: [{
      label: '辣度',
      options: ['中辣', '特辣']
    }, {
      label: '份量',
      options: ['标准份', '加量 +¥5']
    }]
  }]
}, {
  id: 'cat3',
  name: '米饭套餐',
  icon: '🍚',
  items: [{
    id: 'm8',
    name: '咖喱鸡排饭',
    price: 35,
    rating: 4.7,
    sales: 225,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=400&fit=crop',
    desc: '日式咖喱配酥脆鸡排',
    specs: [{
      label: '份量',
      options: ['标准份', '大份 +¥5']
    }]
  }, {
    id: 'm9',
    name: '黑椒牛柳饭',
    price: 42,
    rating: 4.8,
    sales: 189,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&h=400&fit=crop',
    desc: '嫩滑牛柳配黑椒汁',
    specs: [{
      label: '辣度',
      options: ['微辣', '中辣', '特辣']
    }]
  }, {
    id: 'm10',
    name: '照烧鳗鱼饭',
    price: 48,
    rating: 4.9,
    sales: 156,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=400&fit=crop',
    desc: '蒲烧鳗鱼配秘制酱汁',
    specs: [{
      label: '份量',
      options: ['标准份', '加饭 +¥3']
    }]
  }]
}, {
  id: 'cat4',
  name: '小吃甜品',
  icon: '🥟',
  items: [{
    id: 'm11',
    name: '鲜肉锅贴',
    price: 18,
    rating: 4.5,
    sales: 312,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop',
    desc: '底部焦脆，鲜嫩多汁',
    specs: [{
      label: '份量',
      options: ['6个', '12个 +¥12']
    }]
  }, {
    id: 'm12',
    name: '杨枝甘露',
    price: 22,
    rating: 4.6,
    sales: 267,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=400&fit=crop',
    desc: '新鲜芒果配西柚粒',
    specs: [{
      label: '温度',
      options: ['冰镇', '常温']
    }]
  }, {
    id: 'm13',
    name: '芒果糯米饭',
    price: 25,
    rating: 4.7,
    sales: 143,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=400&fit=crop',
    desc: '泰国香糯配新鲜芒果',
    specs: [{
      label: '温度',
      options: ['冰镇', '常温']
    }]
  }, {
    id: 'm14',
    name: '炸春卷',
    price: 16,
    rating: 4.3,
    sales: 198,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop',
    desc: '金黄酥脆，馅料丰富',
    specs: [{
      label: '份量',
      options: ['小份', '大份 +¥4']
    }]
  }]
}, {
  id: 'cat5',
  name: '饮品',
  icon: '🥤',
  items: [{
    id: 'm15',
    name: '冰镇酸梅汤',
    price: 12,
    rating: 4.4,
    sales: 356,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop',
    desc: '古法熬制，酸甜解暑',
    specs: [{
      label: '温度',
      options: ['冰镇', '常温']
    }]
  }, {
    id: 'm16',
    name: '港式奶茶',
    price: 15,
    rating: 4.5,
    sales: 289,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop',
    desc: '正宗港式丝袜奶茶',
    specs: [{
      label: '温度',
      options: ['热饮', '冰饮']
    }, {
      label: '糖度',
      options: ['全糖', '半糖', '无糖']
    }]
  }, {
    id: 'm17',
    name: '柠檬薄荷水',
    price: 10,
    rating: 4.2,
    sales: 176,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop',
    desc: '清新爽口，解腻必备',
    specs: [{
      label: '温度',
      options: ['冰镇', '常温']
    }, {
      label: '糖度',
      options: ['正常糖', '少糖', '无糖']
    }]
  }]
}];
export default function OrderPage(props) {
  const [activeCategory, setActiveCategory] = useState(MENU_DATA[0].id);
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [specItem, setSpecItem] = useState(null);
  const cartArray = useMemo(() => {
    return Object.entries(cart).map(([key, item]) => ({
      menuId: item.menuId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));
  }, [cart]);
  const totalCount = useMemo(() => {
    return cartArray.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartArray]);
  const totalPrice = useMemo(() => {
    return cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartArray]);
  const activeCategoryData = MENU_DATA.find(c => c.id === activeCategory);
  const filteredItems = useMemo(() => {
    if (!activeCategoryData) return [];
    if (!searchQuery.trim()) return activeCategoryData.items;
    const q = searchQuery.toLowerCase();
    return activeCategoryData.items.filter(item => item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q));
  }, [activeCategoryData, searchQuery]);
  const addToCart = (item, specs, qty = 1) => {
    // 兼容 CartPanel 传入的 originalItem（含 specs 对象）
    let resolvedSpecs = specs;
    if (!specs && item.specs && typeof item.specs === 'object') {
      resolvedSpecs = item.specs;
    }
    setCart(prev => {
      // 用 菜品id + 规格组合 作为唯一 key，不同规格视为不同条目
      const specKey = resolvedSpecs ? Object.values(resolvedSpecs).join('/') : '';
      const key = specKey ? `${item.id}__${specKey}` : item.id;
      // 计算规格加价
      let extra = 0;
      if (resolvedSpecs) {
        Object.values(resolvedSpecs).forEach(opt => {
          const m = String(opt).match(/\+¥(\d+(\.\d+)?)/);
          if (m) extra += parseFloat(m[1]);
        });
      }
      const unitPrice = item.price + extra;
      if (prev[key]) {
        return {
          ...prev,
          [key]: {
            ...prev[key],
            quantity: prev[key].quantity + qty
          }
        };
      }
      return {
        ...prev,
        [key]: {
          menuId: item.id,
          name: item.name,
          price: unitPrice,
          quantity: qty,
          image: item.image,
          specs: specKey || ''
        }
      };
    });
  };
  // 点击 + 号：有规格则弹窗，无规格直接加购
  const handleAddClick = item => {
    if (item.specs && item.specs.length > 0) {
      setSpecItem(item);
    } else {
      addToCart(item);
    }
  };
  const handleSpecConfirm = ({
    item,
    specs,
    quantity
  }) => {
    addToCart(item, specs, quantity);
    setSpecItem(null);
  };
  const removeFromCart = (menuId, specs) => {
    setCart(prev => {
      const specKey = specs || '';
      const key = specKey ? `${menuId}__${specKey}` : menuId;
      if (!prev[key]) return prev;
      if (prev[key].quantity <= 1) {
        const {
          [key]: _,
          ...rest
        } = prev;
        return rest;
      }
      return {
        ...prev,
        [key]: {
          ...prev[key],
          quantity: prev[key].quantity - 1
        }
      };
    });
  };
  const clearCart = () => {
    setCart({});
    setShowCart(false);
  };
  const getItemQuantity = itemId => {
    return cart[itemId]?.quantity || 0;
  };
  const handleDetail = itemId => {
    props.$w?.utils?.navigateTo?.({
      pageId: 'detail',
      params: {
        id: itemId
      }
    });
  };
  const handleCheckout = () => {
    if (totalCount === 0) return;
    props.$w?.utils?.navigateTo?.({
      pageId: 'checkout',
      params: {}
    });
  };
  return <div className="min-h-screen bg-[#FFF8F0] font-['DM_Sans']">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-b from-[#FFF8F0] to-[#FFF8F0]/95 backdrop-blur-md">
        <div className="px-5 pt-6 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#370617] tracking-tight">
                味觉食堂
                <span className="inline-block ml-2 text-sm font-['DM_Sans'] font-normal text-[#E85D04] bg-[#E85D04]/10 px-2 py-0.5 rounded-full">营业中</span>
              </h1>
              <p className="text-sm text-[#370617]/60 mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                10:00 - 22:00 · 距您1.2km
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-[#370617]/5 hover:shadow-md transition-shadow">
                <ChefHat className="w-5 h-5 text-[#370617]/70" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#370617]/40" />
            <input type="text" placeholder="搜索菜品..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white border border-[#370617]/8 text-sm text-[#370617] placeholder-[#370617]/40 focus:outline-none focus:border-[#E85D04]/40 focus:ring-2 focus:ring-[#E85D04]/10 transition-all" />
          </div>
        </div>
      </header>

      {/* Body: Left Category + Right Items */}
      <div className="flex">
        {/* Left Vertical Category Sidebar */}
        <aside className="w-24 flex-shrink-0 sticky top-[140px] h-[calc(100vh-140px)] overflow-y-auto bg-[#FFF8F0] border-r border-[#370617]/5 scrollbar-hide">
          <CategoryBar categories={MENU_DATA} activeCategory={activeCategory} onSelect={setActiveCategory} />
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 px-4 pb-32 pt-4 min-w-0">
          <h2 className="font-['Playfair_Display'] text-lg font-bold text-[#370617] mb-3">
            {activeCategoryData?.name}
          </h2>
          {searchQuery.trim() && filteredItems.length === 0 ? <div className="flex flex-col items-center justify-center pt-20 text-center">
              <div className="w-16 h-16 rounded-full bg-[#370617]/5 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-[#370617]/30" />
              </div>
              <p className="text-[#370617]/50 text-sm">没有找到相关菜品</p>
              <button onClick={() => setSearchQuery('')} className="mt-3 text-[#E85D04] text-sm font-medium">
                清空搜索
              </button>
            </div> : <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {activeCategoryData && filteredItems.map((item, index) => <MenuItem key={item.id} item={item} quantity={getItemQuantity(item.id)} onAddClick={handleAddClick} onRemove={() => removeFromCart(item.id)} onDetail={() => handleDetail(item.id)} index={index} />)}
            </div>}
        </main>
      </div>

      {/* Floating Cart Button */}
      {totalCount > 0 && <div className="fixed bottom-24 left-4 right-4 z-40">
          <button onClick={() => setShowCart(true)} className="w-full bg-[#370617] text-white rounded-2xl px-5 py-4 shadow-2xl flex items-center justify-between hover:bg-[#370617]/90 transition-all active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#E85D04] text-white text-xs font-bold flex items-center justify-center">
                  {totalCount}
                </span>
              </div>
              <span className="text-sm font-medium">查看购物车</span>
            </div>
            <span className="font-['Playfair_Display'] text-lg font-bold">
              ¥{totalPrice.toFixed(2)}
            </span>
          </button>
        </div>}

      {/* Cart Panel */}
      <CartPanel show={showCart} onClose={() => setShowCart(false)} items={cartArray} totalPrice={totalPrice} onAdd={addToCart} onRemove={removeFromCart} onClear={clearCart} onCheckout={handleCheckout} $w={props.$w} />

      {/* Spec Selection Modal */}
      <SpecModal show={!!specItem} item={specItem} onClose={() => setSpecItem(null)} onConfirm={handleSpecConfirm} />

      {/* Bottom TabBar */}
      <TabBar active="order" $w={props.$w} />
    </div>;
}