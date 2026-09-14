// @ts-ignore;
import React, { useState, useMemo, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Store, CreditCard, Wallet, Clock, Check, ChevronRight, ShoppingBag, CalendarDays } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

// 模拟购物车数据（实际项目中应从全局状态或数据源获取）
const MOCK_CART = [{
  id: 'm1',
  name: '秘制红烧牛腩面',
  price: 38,
  quantity: 2,
  image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop'
}, {
  id: 'm8',
  name: '咖喱鸡排饭',
  price: 35,
  quantity: 1,
  image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=400&fit=crop'
}, {
  id: 'm15',
  name: '冰镇酸梅汤',
  price: 12,
  quantity: 2,
  image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop'
}];
const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
export default function CheckoutPage(props) {
  const {
    toast
  } = useToast();
  const cart = MOCK_CART;
  const [eatType, setEatType] = useState('today'); // today | reserve
  const [payMethod, setPayMethod] = useState('wechat'); // wechat | alipay | card
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 时间选择状态
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('30');
  const [reserveDay, setReserveDay] = useState(0); // 0-6 未来一周

  // 生成未来一周日期
  const weekDates = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      arr.push({
        offset: i,
        month: d.getMonth() + 1,
        date: d.getDate(),
        week: WEEK_DAYS[d.getDay()],
        isToday: i === 0
      });
    }
    return arr;
  }, []);

  // 小时/分钟选项
  const hours = useMemo(() => {
    const arr = [];
    for (let i = 10; i <= 21; i++) arr.push(String(i).padStart(2, '0'));
    return arr;
  }, []);
  const minutes = useMemo(() => ['00', '15', '30', '45'], []);

  // 切换类型时重置时间提示
  useEffect(() => {
    const now = new Date();
    if (eatType === 'today') {
      const h = now.getHours();
      setHour(String(Math.max(10, Math.min(21, h))).padStart(2, '0'));
      setMinute('00');
    } else {
      setReserveDay(1);
      setHour('18');
      setMinute('00');
    }
  }, [eatType]);
  const subtotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart]);
  const packagingFee = cart.length * 1;
  const total = subtotal + packagingFee;
  const getTimeLabel = () => {
    if (eatType === 'today') {
      return `今天 ${hour}:${minute}`;
    }
    const d = weekDates[reserveDay];
    return `${d.isToday ? '今天' : `${d.month}月${d.date}日`} ${d.week} ${hour}:${minute}`;
  };
  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: '下单成功！',
        description: `订单号 #${Date.now().toString().slice(-6)}，${getTimeLabel()} 到店食用`,
        variant: 'default'
      });
    }, 1200);
  };
  const payMethods = [{
    id: 'wechat',
    name: '微信支付',
    icon: '💚'
  }, {
    id: 'alipay',
    name: '支付宝',
    icon: '💙'
  }, {
    id: 'card',
    name: '银行卡',
    icon: '💳'
  }];
  return <div className="min-h-screen bg-[#FFF8F0] font-['DM_Sans'] pb-32">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-[#370617]/5">
        <button onClick={() => props.$w?.utils?.navigateBack?.()} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-[#370617]/5 hover:shadow-md transition-shadow">
          <ArrowLeft className="w-5 h-5 text-[#370617]/70" />
        </button>
        <h1 className="font-['Playfair_Display'] text-lg font-bold text-[#370617]">确认订单</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Eat Type: 当天 / 预约 */}
        <div className="bg-white rounded-2xl p-4 border border-[#370617]/5">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setEatType('today')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${eatType === 'today' ? 'bg-[#E85D04] text-white shadow-md shadow-[#E85D04]/20' : 'bg-[#FFF8F0] text-[#370617]/60'}`}>
              <Clock className="w-4 h-4" />
              当天
            </button>
            <button onClick={() => setEatType('reserve')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${eatType === 'reserve' ? 'bg-[#E85D04] text-white shadow-md shadow-[#E85D04]/20' : 'bg-[#FFF8F0] text-[#370617]/60'}`}>
              <CalendarDays className="w-4 h-4" />
              预约
            </button>
          </div>

          {/* Time Picker */}
          <div className="bg-[#FFF8F0] rounded-xl p-3">
            {eatType === 'today' ? <>
                {/* 当天：仅选择小时和分钟 */}
                <p className="text-xs text-[#370617]/50 mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />选择到店时间（今天）
                </p>
                <div className="flex items-center justify-center gap-2">
                  <select value={hour} onChange={e => setHour(e.target.value)} className="bg-white border border-[#370617]/8 rounded-lg px-3 py-2 text-sm font-bold text-[#370617] focus:outline-none focus:border-[#E85D04]/40">
                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="text-lg font-bold text-[#370617]/40">:</span>
                  <select value={minute} onChange={e => setMinute(e.target.value)} className="bg-white border border-[#370617]/8 rounded-lg px-3 py-2 text-sm font-bold text-[#370617] focus:outline-none focus:border-[#E85D04]/40">
                    {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </> : <>
                {/* 预约：选择未来一周的 天/时/分 */}
                <p className="text-xs text-[#370617]/50 mb-2 flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />选择预约日期
                </p>
                <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
                  {weekDates.map(d => <button key={d.offset} onClick={() => setReserveDay(d.offset)} className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border transition-all ${reserveDay === d.offset ? 'border-[#E85D04] bg-[#E85D04]/5' : 'border-[#370617]/8 bg-white'}`}>
                      <span className={`text-[11px] ${reserveDay === d.offset ? 'text-[#E85D04] font-bold' : 'text-[#370617]/50'}`}>{d.isToday ? '今天' : d.week}</span>
                      <span className={`text-sm font-bold ${reserveDay === d.offset ? 'text-[#370617]' : 'text-[#370617]/70'}`}>{d.date}</span>
                    </button>)}
                </div>
                <p className="text-xs text-[#370617]/50 mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />选择到店时间
                </p>
                <div className="flex items-center justify-center gap-2">
                  <select value={hour} onChange={e => setHour(e.target.value)} className="bg-white border border-[#370617]/8 rounded-lg px-3 py-2 text-sm font-bold text-[#370617] focus:outline-none focus:border-[#E85D04]/40">
                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="text-lg font-bold text-[#370617]/40">:</span>
                  <select value={minute} onChange={e => setMinute(e.target.value)} className="bg-white border border-[#370617]/8 rounded-lg px-3 py-2 text-sm font-bold text-[#370617] focus:outline-none focus:border-[#E85D04]/40">
                    {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </>}
          </div>

          {/* Selected time summary */}
          <div className="mt-3 flex items-center gap-2 text-sm text-[#370617]/70">
            <Store className="w-4 h-4 text-[#E85D04]" />
            <span>到店时间：<span className="font-bold text-[#370617]">{getTimeLabel()}</span></span>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-4 border border-[#370617]/5">
          <div className="flex items-center gap-2 mb-3">
            <Store className="w-4 h-4 text-[#E85D04]" />
            <h3 className="font-['Playfair_Display'] text-base font-bold text-[#370617]">味觉食堂</h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#606C38]/10 text-[#606C38] font-medium">到店食用</span>
          </div>
          <div className="space-y-3">
            {cart.map(item => <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#370617] truncate">{item.name}</h4>
                  <p className="text-[#E85D04] font-bold text-sm mt-0.5">¥{item.price}</p>
                </div>
                <span className="text-sm text-[#370617]/50 flex-shrink-0">×{item.quantity}</span>
              </div>)}
          </div>
        </div>

        {/* Remark */}
        <div className="bg-white rounded-2xl p-4 border border-[#370617]/5">
          <label className="text-sm font-bold text-[#370617] mb-2 block">订单备注</label>
          <textarea value={remark} onChange={e => setRemark(e.target.value)} placeholder="口味、偏好等要求（选填）" rows={2} className="w-full text-sm text-[#370617] placeholder-[#370617]/40 bg-[#FFF8F0] rounded-xl p-3 border border-[#370617]/8 focus:outline-none focus:border-[#E85D04]/40 resize-none" />
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4 border border-[#370617]/5">
          <h3 className="font-['Playfair_Display'] text-base font-bold text-[#370617] mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#E85D04]" />
            支付方式
          </h3>
          <div className="space-y-2">
            {payMethods.map(method => {
            const isActive = payMethod === method.id;
            return <button key={method.id} onClick={() => setPayMethod(method.id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all ${isActive ? 'border-[#E85D04] bg-[#E85D04]/5' : 'border-[#370617]/8 hover:border-[#E85D04]/20'}`}>
                  <span className="text-xl">{method.icon}</span>
                  <span className={`text-sm font-medium flex-1 text-left ${isActive ? 'text-[#370617]' : 'text-[#370617]/70'}`}>{method.name}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? 'border-[#E85D04] bg-[#E85D04]' : 'border-[#370617]/20'}`}>
                    {isActive && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>;
          })}
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-2xl p-4 border border-[#370617]/5 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#370617]/60">商品小计</span>
            <span className="text-[#370617] font-medium">¥{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#370617]/60">打包费</span>
            <span className="text-[#370617] font-medium">¥{packagingFee.toFixed(2)}</span>
          </div>
          <div className="border-t border-[#370617]/8 pt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-[#370617]">合计</span>
            <span className="font-['Playfair_Display'] text-xl font-bold text-[#E85D04]">¥{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#370617]/5 px-4 py-3 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <span className="text-xs text-[#370617]/50">应付</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-bold text-[#E85D04]">¥</span>
              <span className="font-['Playfair_Display'] text-2xl font-bold text-[#E85D04]">{total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={submitting} className={`px-8 py-3.5 rounded-2xl text-white font-medium transition-all active:scale-[0.98] flex items-center gap-2 ${submitting ? 'bg-[#370617]/40 cursor-not-allowed' : 'bg-[#E85D04] hover:bg-[#E85D04]/90 shadow-lg shadow-[#E85D04]/20'}`}>
            {submitting ? <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>提交中...</span>
              </> : <span>提交订单</span>}
          </button>
        </div>
      </div>
    </div>;
}