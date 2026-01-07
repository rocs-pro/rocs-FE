import React, { useRef, useEffect } from 'react';
import { ShoppingCart, X, Crown } from 'lucide-react';

export default function BillPanel({ cart, customer, onRemoveItem, onDetachCustomer }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [cart]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const total = subtotal; 

  return (
    <div className="w-4/12 bg-white flex flex-col border-r border-slate-300 shadow-xl z-20 h-full">
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex justify-between items-center shrink-0">
        <div className="text-xs font-bold text-slate-600 uppercase flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-slate-400" /> Current Bill
        </div>
        {customer && (
          <div className="bg-purple-100 border border-purple-200 rounded px-2 py-0.5 flex items-center gap-1.5">
            <Crown className="w-3 h-3 text-purple-600" />
            <span className="text-[10px] font-bold text-purple-800 uppercase">{customer.name}</span>
            <button onClick={onDetachCustomer} className="ml-1 text-purple-400 hover:text-red-500">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <div className="bg-slate-50 border-b border-slate-200 px-3 pb-2 grid grid-cols-12 gap-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider shrink-0">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-4">Description</div>
        <div className="col-span-2 text-center">Qty</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-3 text-right">Amount</div>
      </div>

      <div className="flex-1 overflow-y-auto p-0 bg-white relative custom-scroll" ref={scrollRef}>
        {cart.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 opacity-40 pointer-events-none">
            <ShoppingCart className="w-16 h-16 mb-3" />
            <span className="text-lg font-bold uppercase">Ready</span>
          </div>
        ) : (
          cart.map((item, index) => (
            <div key={index} onClick={() => onRemoveItem(index)} className="grid grid-cols-12 gap-1 px-3 py-2.5 border-b border-slate-100 text-sm items-center hover:bg-red-50 cursor-pointer group transition-colors">
              <div className="col-span-1 text-center text-slate-400 font-mono text-xs group-hover:text-red-500">{index + 1}</div>
              <div className="col-span-4 font-semibold text-slate-800 truncate leading-tight group-hover:text-red-700">{item.name}</div>
              <div className="col-span-2 text-center"><span className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-xs group-hover:bg-red-200 group-hover:text-red-800">{item.qty}</span></div>
              <div className="col-span-2 text-right font-mono text-slate-600 text-xs">{item.price.toFixed(2)}</div>
              <div className="col-span-3 text-right font-mono font-bold text-slate-900 group-hover:text-red-700">{((item.price * item.qty)).toFixed(2)}</div>
            </div>
          ))
        )}
      </div>

      <div className="bg-slate-900 text-white p-4 shrink-0 shadow-[0_-4px_8px_-1px_rgba(0,0,0,0.2)]">
        <div className="flex justify-between items-end mb-3 border-b border-slate-700 pb-2">
            <span className="text-slate-400 text-xs font-medium">Items: <span className="text-white font-mono font-bold text-base">{cart.length}</span></span>
            <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Subtotal</span>
                <span className="text-lg font-mono text-slate-200">{subtotal.toFixed(2)}</span>
            </div>
        </div>
        <div className="bg-slate-800 rounded-lg px-3 py-3 flex justify-between items-center border border-slate-600">
            <span className="text-xl font-bold tracking-tight text-white">TOTAL</span>
            <span className="text-4xl font-bold font-mono text-green-400">{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}