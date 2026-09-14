// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Plus, Minus, Star, ChevronRight } from 'lucide-react';

function TagBadge({
  tag
}) {
  if (!tag) return null;
  const colors = {
    '招牌': 'bg-[#E85D04]/10 text-[#E85D04]',
    '人气': 'bg-[#606C38]/10 text-[#606C38]',
    '主厨推荐': 'bg-[#F4A261]/10 text-[#F4A261]'
  };
  return <span className={`absolute top-2 left-2 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[tag] || 'bg-gray-100 text-gray-600'}`}>
      {tag}
    </span>;
}
export function MenuItem({
  item,
  quantity,
  onAdd,
  onRemove,
  onDetail,
  onAddClick,
  index
}) {
  return <div className="group bg-white rounded-2xl overflow-hidden border border-[#370617]/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" style={{
    animationDelay: `${index * 60}ms`
  }}>
      {/* Image Container - click to view detail */}
      <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={onDetail}>
        <TagBadge tag={item.tag} />
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-4 h-4 text-[#370617]/60" />
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 onClick={onDetail} className="font-['Playfair_Display'] text-sm font-bold text-[#370617] leading-tight mb-1 cursor-pointer hover:text-[#E85D04] transition-colors">
          {item.name}
        </h3>
        <p className="text-xs text-[#370617]/50 leading-relaxed mb-2 line-clamp-1">
          {item.desc}
        </p>

        {/* Rating & Sales */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[#F4A261] fill-[#F4A261]" />
            <span className="text-xs font-medium text-[#370617]/70">{item.rating}</span>
          </div>
          <span className="text-xs text-[#370617]/40">月售{item.sales}</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[10px] font-bold text-[#E85D04]">¥</span>
            <span className="font-['Playfair_Display'] text-lg font-bold text-[#E85D04]">{item.price}</span>
          </div>
          {quantity === 0 ? <button onClick={() => onAddClick(item)} className="w-8 h-8 rounded-full bg-[#E85D04] text-white flex items-center justify-center hover:bg-[#E85D04]/90 active:scale-90 transition-all shadow-md shadow-[#E85D04]/20">
              <Plus className="w-4 h-4" />
            </button> : <div className="flex items-center gap-2 bg-[#FFF8F0] rounded-full px-1.5 py-1">
              <button onClick={onRemove} className="w-6 h-6 rounded-full bg-white border border-[#E85D04]/20 text-[#E85D04] flex items-center justify-center hover:bg-[#E85D04] hover:text-white active:scale-90 transition-all">
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-bold text-[#370617] min-w-[1.2rem] text-center">
                {quantity}
              </span>
              <button onClick={() => onAddClick(item)} className="w-6 h-6 rounded-full bg-[#E85D04] text-white flex items-center justify-center hover:bg-[#E85D04]/90 active:scale-90 transition-all">
                <Plus className="w-3 h-3" />
              </button>
            </div>}
        </div>
      </div>
    </div>;
}