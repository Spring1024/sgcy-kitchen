// @ts-ignore;
import React, { useState, useMemo } from 'react';
// @ts-ignore;
import { ArrowLeft, Plus, Minus, Star, Clock, Fire, ShoppingCart, Check } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

// 菜品数据（实际项目中应从数据源获取，这里用 params.id 匹配）
const ALL_DISHES = [{
  id: 'm1',
  name: '秘制红烧牛腩面',
  price: 38,
  rating: 4.9,
  sales: 286,
  image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop',
  desc: '慢炖6小时的牛腩，搭配手工拉面',
  tag: '招牌',
  category: '招牌推荐',
  spicy: 2,
  prepTime: 15,
  calories: 520,
  ingredients: ['手工拉面', '牛腩', '秘制酱汁', '青菜', '卤蛋'],
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
  category: '招牌推荐',
  spicy: 1,
  prepTime: 12,
  calories: 610,
  ingredients: ['蜜汁叉烧', '溏心蛋', '米饭', '西兰花', '味噌汤'],
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
  category: '招牌推荐',
  spicy: 2,
  prepTime: 18,
  calories: 480,
  ingredients: ['鲜虾', '鱿鱼', '椰浆汤底', '油面', '豆芽'],
  specs: [{
    label: '辣度',
    options: ['微辣', '中辣']
  }]
}, {
  id: 'm8',
  name: '咖喱鸡排饭',
  price: 35,
  rating: 4.7,
  sales: 225,
  image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=400&fit=crop',
  desc: '日式咖喱配酥脆鸡排',
  tag: '',
  category: '米饭套餐',
  spicy: 1,
  prepTime: 14,
  calories: 580,
  ingredients: ['酥脆鸡排', '日式咖喱', '米饭', '玉米粒'],
  specs: [{
    label: '份量',
    options: ['标准份', '大份 +¥5']
  }]
}, {
  id: 'm15',
  name: '冰镇酸梅汤',
  price: 12,
  rating: 4.4,
  sales: 356,
  image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop',
  desc: '古法熬制，酸甜解暑',
  tag: '',
  category: '饮品',
  spicy: 0,
  prepTime: 2,
  calories: 90,
  ingredients: ['乌梅', '山楂', '陈皮', '冰糖'],
  specs: [{
    label: '温度',
    options: ['冰镇', '常温']
  }]
}];
export default function DetailPage(props) {
  const {
    toast
  } = useToast();
  const dishId = props.$w?.page?.dataset?.params?.id || 'm1';
  const dish = useMemo(() => ALL_DISHES.find(d => d.id === dishId) || ALL_DISHES[0], [dishId]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [added, setAdded] = useState(false);
  const handleSpecSelect = (label, option) => {
    setSelectedSpecs(prev => ({
      ...prev,
      [label]: option
    }));
  };
  const handleAddToCart = () => {
    setAdded(true);
    toast({
      title: '已加入购物车',
      description: `${dish.name} ×${quantity}`,
      variant: 'default'
    });
    setTimeout(() => setAdded(false), 1500);
  };
  const spicyDots = Array.from({
    length: 3
  }, (_, i) => i < dish.spicy);
  return <div className="min-h-screen bg-[#FFF8F0] font-['DM_Sans'] pb-28">
      {/* Hero Image */}
      <div className="relative h-72 overflow-hidden">
        <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#370617]/60 via-transparent to-[#370617]/20" />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 px-4 py-3 flex items-center justify-between">
          <button onClick={() => props.$w?.utils?.navigateBack?.()} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:shadow-md transition-shadow">
            <ArrowLeft className="w-5 h-5 text-[#370617]/70" />
          </button>
          <button onClick={() => toast({
          title: '已收藏',
          description: dish.name,
          variant: 'default'
        })} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:shadow-md transition-shadow">
            <Star className="w-5 h-5 text-[#F4A261] fill-[#F4A261]" />
          </button>
        </div>

        {/* Tag Badge */}
        {dish.tag && <div className="absolute top-16 left-4">
            <span className="bg-[#E85D04] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {dish.tag}
            </span>
          </div>}
      </div>

      {/* Content */}
      <div className="px-5 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-[#370617]/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#370617] leading-tight">{dish.name}</h1>
              <p className="text-sm text-[#370617]/50 mt-1">{dish.category}</p>
            </div>
            <div className="flex items-baseline gap-0.5 flex-shrink-0">
              <span className="text-sm font-bold text-[#E85D04]">¥</span>
              <span className="font-['Playfair_Display'] text-3xl font-bold text-[#E85D04]">{dish.price}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#370617]/5">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#F4A261] fill-[#F4A261]" />
              <span className="text-sm font-medium text-[#370617]/70">{dish.rating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#606C38]" />
              <span className="text-sm text-[#370617]/60">约{dish.prepTime}分钟</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fire className="w-4 h-4 text-[#E85D04]" />
              <span className="text-sm text-[#370617]/60">{dish.calories} kcal</span>
            </div>
            {dish.spicy > 0 && <div className="flex items-center gap-1">
                {spicyDots.map((active, i) => <span key={i} className={`w-2 h-2 rounded-full ${active ? 'bg-[#E85D04]' : 'bg-[#370617]/10'}`} />)}
              </div>}
          </div>

          {/* Description */}
          <p className="text-sm text-[#370617]/60 leading-relaxed mt-3">{dish.desc}</p>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-2xl p-5 mt-4 shadow-sm border border-[#370617]/5">
          <h3 className="font-['Playfair_Display'] text-base font-bold text-[#370617] mb-3">食材配料</h3>
          <div className="flex flex-wrap gap-2">
            {dish.ingredients.map(ing => <span key={ing} className="text-xs text-[#370617]/70 bg-[#FFF8F0] px-3 py-1.5 rounded-full border border-[#370617]/8">
                {ing}
              </span>)}
          </div>
        </div>

        {/* Specs */}
        {dish.specs.map(spec => <div key={spec.label} className="bg-white rounded-2xl p-5 mt-4 shadow-sm border border-[#370617]/5">
            <h3 className="font-['Playfair_Display'] text-base font-bold text-[#370617] mb-3">{spec.label}</h3>
            <div className="flex flex-wrap gap-2">
              {spec.options.map(opt => {
            const isActive = selectedSpecs[spec.label] === opt;
            return <button key={opt} onClick={() => handleSpecSelect(spec.label, opt)} className={`text-sm px-4 py-2 rounded-full border transition-all ${isActive ? 'border-[#E85D04] bg-[#E85D04]/5 text-[#E85D04] font-medium' : 'border-[#370617]/8 text-[#370617]/60 hover:border-[#E85D04]/20'}`}>
                  {opt}
                </button>;
          })}
            </div>
          </div>)}

        {/* Quantity Selector */}
        <div className="bg-white rounded-2xl p-5 mt-4 shadow-sm border border-[#370617]/5 flex items-center justify-between">
          <h3 className="font-['Playfair_Display'] text-base font-bold text-[#370617]">购买数量</h3>
          <div className="flex items-center gap-3 bg-[#FFF8F0] rounded-full px-2 py-1.5">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-white border border-[#E85D04]/20 text-[#E85D04] flex items-center justify-center hover:bg-[#E85D04] hover:text-white active:scale-90 transition-all">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-base font-bold text-[#370617] min-w-[1.5rem] text-center">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 rounded-full bg-[#E85D04] text-white flex items-center justify-center hover:bg-[#E85D04]/90 active:scale-90 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#370617]/5 px-4 py-3 shadow-2xl">
        <div className="flex items-center gap-3">
          <button onClick={() => props.$w?.utils?.navigateTo?.({
          pageId: 'order',
          params: {}
        })} className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#370617]/8 flex items-center justify-center hover:shadow-md transition-shadow">
            <ShoppingCart className="w-5 h-5 text-[#370617]/70" />
          </button>
          <button onClick={handleAddToCart} className={`flex-1 py-3.5 rounded-2xl text-white font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${added ? 'bg-[#606C38]' : 'bg-[#E85D04] hover:bg-[#E85D04]/90 shadow-lg shadow-[#E85D04]/20'}`}>
            {added ? <>
                <Check className="w-5 h-5" />
                <span>已加入</span>
              </> : <>
                <Plus className="w-5 h-5" />
                <span>加入购物车 ¥{(dish.price * quantity).toFixed(2)}</span>
              </>}
          </button>
        </div>
      </div>
    </div>;
}