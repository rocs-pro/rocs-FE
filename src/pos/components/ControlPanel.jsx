import React from 'react';
import { ScanBarcode, Hand, CornerUpLeft, RotateCw, Printer, Percent, Disc } from 'lucide-react';

export default function ControlPanel({ 
    inputRef, 
    inputBuffer, 
    setInputBuffer, 
    onScan, 
    onOpenModal, 
    onVoid,
    onAction,
    isEnabled 
}) {
  return (
    <div className="w-4/12 bg-slate-50 flex flex-col h-full border-r border-slate-200 z-10">
      
      {/* SCANNER INPUT AREA */}
      <div className="p-3 bg-white border-b border-slate-200 shrink-0">
         <div className="flex gap-0 rounded-md shadow-sm border border-blue-300 overflow-hidden h-14">
            <div className="bg-blue-50 px-3 flex items-center border-r border-blue-200">
                <ScanBarcode className="w-6 h-6 text-blue-700" />
            </div>
            <input 
              ref={inputRef}
              type="text" 
              value={inputBuffer}
              onChange={(e) => setInputBuffer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onScan()}
              className="flex-1 px-3 text-xl font-mono text-slate-800 focus:outline-none focus:bg-white transition font-bold" 
              placeholder="Scan / PLU..." 
              disabled={!isEnabled}
            />
            <button onClick={onScan} className="bg-blue-600 text-white px-5 font-bold hover:bg-blue-700 transition active:bg-blue-800 text-sm tracking-wide">
                ENTER
            </button>
         </div>
      </div>

      {/* FUNCTION BUTTONS GRID */}
      <div className="flex-1 flex flex-col p-2 gap-2 overflow-hidden min-h-0">
          
          {/* Top Grid: F-Keys */}
          <div className="grid grid-cols-2 gap-2 flex-[2] min-h-0">
            <button onClick={() => onOpenModal('PRICE_CHECK')} className="bg-white border-2 border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 flex flex-col items-center justify-center p-1 transition-colors h-full active:scale-95">
                <span className="text-sm font-bold text-slate-700">Price Check</span>
                <span className="text-slate-400 text-[10px] font-mono">(F1)</span>
            </button>
            <button onClick={onVoid} className="bg-red-50 border-2 border-red-200 rounded-lg shadow-sm hover:bg-red-100 flex flex-col items-center justify-center p-1 transition-colors h-full active:scale-95">
                <span className="text-sm font-bold text-red-700">Void Item</span>
                <span className="text-red-600/60 text-[10px] font-mono">(Del)</span>
            </button>
            
            <button onClick={() => onAction('RECALL')} className="col-span-2 bg-white border-2 border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 flex flex-col items-center justify-center p-1 transition-colors h-full active:scale-95">
                <span className="text-sm font-bold text-slate-700">Recall Bill</span>
                <span className="text-slate-400 text-[10px] font-mono">(F3)</span>
            </button>
             <button onClick={() => onAction('CANCEL')} className="col-span-2 bg-red-50 border-2 border-red-200 rounded-lg shadow-sm hover:bg-red-100 flex flex-col items-center justify-center p-1 transition-colors h-full active:scale-95">
                <span className="text-sm font-bold text-red-700">Cancel Transaction</span>
                <span className="text-red-600/60 text-[10px] font-mono">(F4)</span>
            </button>
          </div>

          {/* Middle Row: Operations */}
          <div className="grid grid-cols-3 gap-2 h-14 shrink-0">
             <button onClick={() => onAction('HOLD')} className="bg-yellow-50 border border-yellow-200 rounded shadow-sm hover:bg-yellow-100 flex items-center justify-center gap-1 h-full active:scale-95">
                <Hand className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-bold text-yellow-800">Hold</span>
             </button>
             <button onClick={() => onAction('RETURN')} className="bg-rose-50 border border-rose-200 rounded shadow-sm hover:bg-rose-100 flex items-center justify-center gap-1 h-full active:scale-95">
                <CornerUpLeft className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-rose-800">Return</span>
             </button>
             
             <button onClick={() => window.location.reload()} className="bg-blue-50 border border-blue-200 rounded shadow-sm hover:bg-blue-100 flex items-center justify-center gap-1 h-full active:scale-95">
                <RotateCw className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-800">Reset</span>
             </button>
          </div>

          {/* Bottom Grid: Admin/Misc */}
          <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
            <button onClick={() => onOpenModal('PAID_IN')} className="bg-slate-100 border border-slate-200 rounded shadow-sm hover:bg-slate-200 flex items-center justify-center h-full active:scale-95">
                <span className="text-xs font-bold text-slate-700">Paid In</span>
            </button>
            <button onClick={() => onOpenModal('PAID_OUT')} className="bg-slate-100 border border-slate-200 rounded shadow-sm hover:bg-slate-200 flex items-center justify-center h-full active:scale-95">
                <span className="text-xs font-bold text-slate-700">Paid Out</span>
            </button>
            <button onClick={() => onOpenModal('LOYALTY')} className="bg-purple-50 border border-purple-200 rounded shadow-sm hover:bg-purple-100 flex items-center justify-center h-full active:scale-95">
                <span className="text-xs font-bold text-purple-800">Loyalty</span>
            </button>
            <button onClick={() => onOpenModal('REGISTER')} className="bg-purple-50 border border-purple-200 rounded shadow-sm hover:bg-purple-100 flex items-center justify-center h-full active:scale-95">
                <span className="text-xs font-bold text-purple-800">Register</span>
            </button>
          </div>
      </div>

      {/* FOOTER: PAYMENTS */}
      <div className="mt-auto p-3 border-t border-slate-300 bg-white shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-3 gap-2 mb-2">
            <button className="h-10 bg-slate-50 border border-slate-300 rounded shadow-sm flex items-center justify-center gap-1 hover:bg-slate-100 active:scale-95">
                <Printer className="w-4 h-4 text-slate-600" />
                <span className="text-[10px] font-bold text-slate-700">Print</span>
            </button>
            <button className="h-10 bg-slate-50 border border-slate-300 rounded shadow-sm flex items-center justify-center gap-1 hover:bg-slate-100 active:scale-95">
                <Disc className="w-4 h-4 text-slate-600" />
                <span className="text-[10px] font-bold text-slate-700">No Sale</span>
            </button>
            <button className="h-10 bg-yellow-50 border border-yellow-200 rounded shadow-sm flex items-center justify-center gap-1 hover:bg-yellow-100 active:scale-95">
                <Percent className="w-4 h-4 text-yellow-600" />
                <span className="text-[10px] font-bold text-yellow-800">Disc</span>
            </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
             <button onClick={() => onAction('PAY_CASH')} className="h-20 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg flex flex-col items-center justify-center border-b-[6px] border-green-800 active:border-b-0 active:mt-1.5 transition-all col-span-2">
                <span className="font-bold text-3xl tracking-wider">CASH</span>
                <span className="text-xs opacity-80 uppercase font-mono mt-0.5">Space</span>
             </button>
             <button onClick={() => onAction('PAY_CARD')} className="h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg flex flex-col items-center justify-center border-b-[6px] border-blue-800 active:border-b-0 active:mt-1.5 transition-all">
                <span className="font-bold text-xl tracking-wider">CARD</span>
                <span className="text-[10px] opacity-80 uppercase font-mono mt-0.5">F10</span>
             </button>
             
             {/* ADDED: QR ACTION HERE */}
             <button onClick={() => onAction('PAY_QR')} className="h-16 bg-slate-700 hover:bg-slate-800 text-white rounded-lg shadow-lg flex flex-col items-center justify-center border-b-[6px] border-slate-900 active:border-b-0 active:mt-1.5 transition-all">
                <span className="font-bold text-xl tracking-wider">QR</span>
                <span className="text-[10px] opacity-80 uppercase font-mono mt-0.5">F11</span>
             </button>
        </div>
      </div>
    </div>
  );
}