// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { X, Plus, Minus, Check } from 'lucide-react';

export function SpecModal({
  show,
  item,
  onClose,
  onConfirm
}) {
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [quantity, setQuantity] = useState(1);

  // 每次打开弹窗时重置选择（默认选中每个规格的第一项）
  useEffect(() => {
    if (show && item) {
      const defaults = {};
      (item.specs || []).forEach(spec => {
        if (spec.options && spec.options.length > 0) {
          defaults[spec.label] = spec.options[0];
        }
      });
      setSelectedSpecs(defaults);
      setQuantity(1);
    }
  }, [show, item]);
  if (!show || !item) return null;
  const handleSpecSelect = (label, option) => {
    setSelectedSpecs(prev => ({
      ...prev,
      [label]: option
    }));
  };

  // 计算加价（解析 "+¥6" 等格式）
  const getExtraPrice = () => {
    let extra = 0;
    Object.values(selectedSpecs).forEach(opt => {
      const match = String(opt).match(/\+¥(\d+(\.\d+)?)/);
      if (match) extra += parseFloat(match[1]);
    });
    return extra;
  };
  const unitPrice = item.price + getExtraPrice();
  const totalPrice = unitPrice * quantity;
  const handleConfirm = () => {
    onConfirm({
      item,
      specs: selectedSpecs,
      quantity
    });
  };
  return <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#370617]/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-[#FFF8F0] rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[#370617]/8">
          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-['Playfair_Display'] text-base font-bold text-[#370617] leading-tight truncate">{item.name}</h3>
            <p className="text-xs text-[#370617]/50 mt-0.5 line-clamp-1">{item.desc}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-[#370617]/8 flex items-center justify-center hover:bg-[#370617]/5 transition-colors flex-shrink-0">
            <X className="w-4 h-4 text-[#370617]/60" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-hide">
          {item.specs && item.specs.length > 0 ? item.specs.map(spec => <div key={spec.label} className="mb-4">
              <h4 className="font-['Playfair_Display'] text-sm font-bold text-[#370617] mb-2">{spec.label}</h4>
              <div className="flex flex-wrap gap-2">
                {spec.options.map(opt => {
              const isActive = selectedSpecs[spec.label] === opt;
              return <button key={opt} onClick={() => handleSpecSelect(spec.label, opt)} className={`text-sm px-4 py-2 rounded-full border transition-all ${isActive ? 'border-[#E85D04] bg-[#E85D04]/5 text-[#E85D04] font-medium' : 'border-[#370617]/8 text-[#370617]/60 hover:border-[#E85D04]/20'}`}>
                      {opt}
                    </button>;
            })}
              </div>
            </div>) : <p className="text-sm text-[#370617]/40 text-center py-4">该商品暂无可选项</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-4 border-t border-[#370617]/8 bg-white rounded-b-3xl">
          {/* Quantity */}
          <div className="flex items-center gap-2 bg-[#FFF8F0] rounded-full px-2 py-1.5">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-white border border-[#E85D04]/20 text-[#E85D04] flex items-center justify-center hover:bg-[#E85D04] hover:text-white active:scale-90 transition-all">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-base font-bold text-[#370617] min-w-[1.5rem] text-center">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 rounded-full bg-[#E85D04] text-white flex items-center justify-center hover:bg-[#E85D04]/90 active:scale-90 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Confirm */}
          <button onClick={handleConfirm} className="flex-1 py-3 rounded-2xl bg-[#E85D04] text-white font-medium hover:bg-[#E85D04]/90 active:scale-[0.98] transition-all shadow-lg shadow-[#E85D04]/20 flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>加入 ¥{totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>;
}