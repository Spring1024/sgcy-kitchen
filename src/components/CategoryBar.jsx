// @ts-ignore;
import React from 'react';

// 左侧竖向分类导航
// 使用方式：<CategoryBar categories={...} activeCategory={...} onSelect={...} />
export function CategoryBar({
  categories,
  activeCategory,
  onSelect
}) {
  return <div className="w-full">
      {categories.map(cat => {
      const isActive = cat.id === activeCategory;
      return <button key={cat.id} onClick={() => onSelect(cat.id)} className={`
            relative w-full flex items-center gap-2.5 px-3 py-3.5 text-left
            transition-all duration-200 border-l-2
            ${isActive ? 'bg-[#E85D04]/8 border-[#E85D04] text-[#E85D04]' : 'bg-transparent border-transparent text-[#370617]/60 hover:bg-[#370617]/3 hover:text-[#370617]/80'}
          `}>
            <span className="text-lg flex-shrink-0">{cat.icon}</span>
            <span className={`text-sm font-medium truncate ${isActive ? 'font-bold' : ''}`}>{cat.name}</span>
            {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#E85D04] rounded-r-full" />}
          </button>;
    })}
    </div>;
}