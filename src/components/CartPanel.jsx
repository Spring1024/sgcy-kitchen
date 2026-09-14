// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export function CartPanel({
  show,
  onClose,
  items,
  totalPrice,
  onAdd,
  onRemove,
  onClear,
  onCheckout
}) {
  if (!show) return null;
  return <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Cart Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] animate-slide-up">
        <div className="bg-white rounded-t-3xl max-h-[70vh] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#370617]/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#370617] flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-['Playfair_Display'] text-base font-bold text-[#370617]">
                  购物车
                </h3>
                <p className="text-xs text-[#370617]/50">{items.length}种商品</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && <button onClick={onClear} className="text-xs text-[#370617]/50 hover:text-red-500 flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-red-50 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                  清空
                </button>}
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#370617]/5 flex items-center justify-center hover:bg-[#370617]/10 transition-colors">
                <X className="w-4 h-4 text-[#370617]/60" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
            {items.length === 0 ? <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-[#FFF8F0] flex items-center justify-center mb-3">
                  <ShoppingCart className="w-6 h-6 text-[#E85D04]/40" />
                </div>
                <p className="text-sm text-[#370617]/40">购物车还是空的</p>
                <p className="text-xs text-[#370617]/30 mt-1">快去挑选美食吧</p>
              </div> : items.map(item => <div key={item.menuId + (item.specs || '')} className="flex items-center gap-3 bg-[#FFF8F0] rounded-xl p-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#370617] truncate">
                      {item.name}
                    </h4>
                    {item.specs ? <p className="text-[11px] text-[#370617]/50 mt-0.5 truncate">
                        {item.specs}
                      </p> : null}
                    <p className="text-[#E85D04] font-bold mt-1">
                      ¥<span className="text-base">{item.price}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-1.5 py-1 shadow-sm">
                    <button onClick={() => onRemove(item.menuId, item.specs)} className="w-6 h-6 rounded-full border border-[#E85D04]/20 text-[#E85D04] flex items-center justify-center hover:bg-[#E85D04] hover:text-white active:scale-90 transition-all">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold text-[#370617] min-w-[1.2rem] text-center">
                      {item.quantity}
                    </span>
                    <button onClick={() => {
                const originalItem = {
                  id: item.menuId,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  specs: item.specs ? item.specs.split('/').reduce((acc, val, i) => {
                    const labels = ['份量', '辣度', '温度', '糖度'];
                    acc[labels[i] || `规格${i + 1}`] = val;
                    return acc;
                  }, {}) : null
                };
                onAdd(originalItem);
              }} className="w-6 h-6 rounded-full bg-[#E85D04] text-white flex items-center justify-center hover:bg-[#E85D04]/90 active:scale-90 transition-all">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>)}
          </div>

          {/* Checkout Button */}
          <div className="px-5 pt-3 pb-6 border-t border-[#370617]/5">
            <button onClick={onCheckout} disabled={items.length === 0} className={`w-full rounded-2xl py-4 flex items-center justify-between px-5 transition-all active:scale-[0.98]
                ${items.length === 0 ? 'bg-[#370617]/10 text-[#370617]/40 cursor-not-allowed' : 'bg-[#370617] text-white hover:bg-[#370617]/90 shadow-lg'}
              `}>
              <span className="text-sm font-medium">
                合计 <span className="font-['Playfair_Display'] text-lg font-bold">¥{totalPrice.toFixed(2)}</span>
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                去结算
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>;
}