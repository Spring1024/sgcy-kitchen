// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { X, Plus, Trash2, Flame, Candy, Citrus, Settings2 } from 'lucide-react';

// 菜品新增/编辑通用表单弹窗
// initial: 编辑时带入的菜品数据；为空则为新增
// onClose: 关闭弹窗
// onSave: 保存回调，接收完整菜品对象
export function DishFormModal({
  initial,
  onClose,
  onSave
}) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name || '');
  const [category, setCategory] = useState(initial?.category || '招牌主食');
  const [price, setPrice] = useState(initial?.price ? String(initial.price) : '');
  const [stock, setStock] = useState(initial?.stock !== undefined ? String(initial.stock) : '');
  const [image, setImage] = useState(initial?.image || '');
  const [options, setOptions] = useState(Array.isArray(initial?.options) ? initial.options : []);
  const [newOptName, setNewOptName] = useState('');
  const [newValue, setNewValue] = useState({});
  const safeNewValue = newValue || {};
  const CATEGORIES = ['招牌主食', '热菜', '汤品', '甜品', '饮品'];
  const QUICK = [{
    name: '辣度',
    icon: Flame
  }, {
    name: '甜度',
    icon: Candy
  }, {
    name: '酸度',
    icon: Citrus
  }];
  const addOption = () => {
    const n = newOptName.trim();
    if (!n) return;
    if (options.some(o => o.name === n)) return;
    setOptions(prev => [...prev, {
      name: n,
      values: []
    }]);
    setNewOptName('');
  };
  const addQuick = name => {
    if (options.some(o => o.name === name)) return;
    setOptions(prev => [...prev, {
      name,
      values: []
    }]);
  };
  const removeOption = idx => {
    setOptions(prev => prev.filter((_, i) => i !== idx));
    const v = {
      ...(newValue || {})
    };
    delete v[idx];
    setNewValue(v);
  };
  const addValue = idx => {
    const val = (newValue && newValue[idx] || '').trim();
    if (!val) return;
    setOptions(prev => prev.map((o, i) => i === idx ? {
      ...o,
      values: [...o.values, val]
    } : o));
    setNewValue(prev => ({
      ...(prev || {}),
      [idx]: ''
    }));
  };
  const removeValue = (idx, vIdx) => {
    setOptions(prev => prev.map((o, i) => i === idx ? {
      ...o,
      values: o.values.filter((_, k) => k !== vIdx)
    } : o));
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!name.trim()) {
      alert('请填写菜品名称');
      return;
    }
    if (!price || Number(price) <= 0) {
      alert('请填写有效价格');
      return;
    }
    onSave({
      id: initial?.id || 'm' + Date.now(),
      name: name.trim(),
      category,
      price: Number(price),
      stock: stock ? Number(stock) : 0,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80',
      online: initial?.online !== undefined ? initial.online : true,
      sold: initial?.sold || 0,
      options
    });
  };
  return <div className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-3xl p-5 max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1B1A16]">{isEdit ? '编辑菜品' : '新增菜品'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#FAF3EC] flex items-center justify-center text-[#370617]/40">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 基础信息 */}
          <div>
            <label className="text-xs text-[#370617]/50">菜品名称</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="如：麻辣香锅" className="w-full mt-1 bg-[#FAF3EC] rounded-xl px-3 py-2.5 text-sm border border-[#370617]/8 outline-none focus:border-[#E85D04]" />
          </div>
          <div>
            <label className="text-xs text-[#370617]/50">分类</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {CATEGORIES.map(c => <button type="button" key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-xs border transition-all ${category === c ? 'bg-[#E85D04] text-white border-[#E85D04]' : 'bg-[#FAF3EC] text-[#370617]/50 border-[#370617]/8'}`}>{c}</button>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#370617]/50">价格 (¥)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" className="w-full mt-1 bg-[#FAF3EC] rounded-xl px-3 py-2.5 text-sm border border-[#370617]/8 outline-none focus:border-[#E85D04]" />
            </div>
            <div>
              <label className="text-xs text-[#370617]/50">库存</label>
              <input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="0" className="w-full mt-1 bg-[#FAF3EC] rounded-xl px-3 py-2.5 text-sm border border-[#370617]/8 outline-none focus:border-[#E85D04]" />
            </div>
          </div>
          <div>
            <label className="text-xs text-[#370617]/50">图片链接（可选）</label>
            <input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." className="w-full mt-1 bg-[#FAF3EC] rounded-xl px-3 py-2.5 text-sm border border-[#370617]/8 outline-none focus:border-[#E85D04]" />
          </div>

          {/* 自定义配置项 */}
          <div className="pt-1 border-t border-[#370617]/8">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-4 h-4 text-[#E85D04]" />
              <span className="text-sm font-bold text-[#1B1A16]">自定义配置项</span>
            </div>
            <p className="text-[11px] text-[#370617]/40 mb-2">如辣度、甜度、酸度等，可添加维度与选项值</p>

            {/* 快捷添加 */}
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK.map(q => {
              const Icon = q.icon;
              const added = options.some(o => o.name === q.name);
              return <button type="button" key={q.name} onClick={() => addQuick(q.name)} disabled={added} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border transition-all ${added ? 'bg-[#370617]/5 text-[#370617]/30 border-[#370617]/8' : 'bg-[#FFF8F0] text-[#E85D04] border-[#E85D04]/20 active:scale-95'}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {q.name}
                </button>;
            })}
            </div>

            {/* 已有配置项 */}
            <div className="space-y-3">
              {options.map((opt, idx) => <div key={idx} className="bg-[#FAF3EC] rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#1B1A16]">{opt.name}</span>
                    <button type="button" onClick={() => removeOption(idx)} className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#370617]/40">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {opt.values.map((v, vIdx) => <span key={vIdx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-xs text-[#370617] border border-[#370617]/8">
                        {v}
                        <button type="button" onClick={() => removeValue(idx, vIdx)} className="text-[#370617]/30 hover:text-[#E85D04]">
                          <X className="w-3 h-3" />
                        </button>
                      </span>)}
                    {opt.values.length === 0 && <span className="text-[11px] text-[#370617]/30">暂无选项值，请在下方添加</span>}
                  </div>
                  <div className="flex gap-2">
                    <input value={safeNewValue[idx] || ''} onChange={e => setNewValue(prev => ({
                  ...(prev || {}),
                  [idx]: e.target.value
                }))} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addValue(idx))} placeholder={`添加${opt.name}选项值`} className="flex-1 bg-white rounded-lg px-2.5 py-1.5 text-xs border border-[#370617]/8 outline-none focus:border-[#E85D04]" />
                    <button type="button" onClick={() => addValue(idx)} className="px-3 py-1.5 rounded-lg bg-[#E85D04] text-white text-xs font-bold active:scale-95">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>)}
            </div>

            {/* 新增配置项维度 */}
            <div className="flex gap-2 mt-3">
              <input value={newOptName} onChange={e => setNewOptName(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addOption())} placeholder="自定义配置项名称，如：份量" className="flex-1 bg-white rounded-xl px-3 py-2.5 text-sm border border-[#370617]/8 outline-none focus:border-[#E85D04]" />
              <button type="button" onClick={addOption} className="px-4 py-2.5 rounded-xl bg-[#1B1A16] text-white text-sm font-bold active:scale-95 flex items-center gap-1">
                <Plus className="w-4 h-4" />
                添加
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#E85D04] rounded-xl py-3 text-white font-bold shadow-md shadow-[#E85D04]/20 active:scale-95 transition-all">
            {isEdit ? '保存修改' : '创建菜品'}
          </button>
        </form>
      </div>
    </div>;
}