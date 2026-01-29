import React, { useState, useEffect, useRef } from 'react';
import { Tag, X, Search, Package, AlertCircle } from 'lucide-react';
import { posService } from '../../services/posService'; 

export default function PriceCheckModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(false);
    setResult(null);

    try {
        // API Call
        const res = await posService.getProduct(query);
        const rawData = res.data?.data || res.data; // Extract actual data

        if (rawData) {
             // Map to standard object if keys differ
             setResult({
                 id: rawData.productId || rawData.id,
                 name: rawData.name,
                 price: rawData.sellingPrice !== undefined ? rawData.sellingPrice : rawData.price
             });
        } else {
             setError(true);
        }
    } catch (err) {
        setError(true);
    }
    setLoading(false);
    setQuery("");
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
      <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden transform transition-all">
        <div className="bg-slate-800 px-4 py-3 flex justify-between items-center">
            <h3 className="text-white font-bold text-lg flex items-center gap-2"><Tag className="w-5 h-5 text-blue-400"/> Price Verifier</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Scan Item / Enter Code</label>
            <form onSubmit={handleSearch} className="flex gap-0 mb-4 border border-slate-300 rounded overflow-hidden">
                <input 
                  ref={inputRef}
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 px-3 py-2 text-lg font-mono font-bold focus:outline-none focus:bg-slate-50 text-slate-800" 
                  placeholder="Scan..." 
                />
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 font-bold hover:bg-blue-700">
                    {loading ? "..." : <Search className="w-5 h-5"/>}
                </button>
            </form>

            {result && (
              <div className="text-center space-y-3 pt-2 fade-enter-active">
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Item Price</div>
                  <div className="text-5xl font-bold font-mono text-slate-900">
                      <span className="text-2xl align-top text-slate-400">LKR</span> {result.price.toFixed(2)}
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-left">
                      <div className="text-sm font-bold text-slate-800 leading-tight mb-1">{result.name}</div>
                      <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{result.id}</span>
                          <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Package className="w-3 h-3"/> In Stock</span>
                      </div>
                  </div>
              </div>
            )}

            {error && (
              <div className="text-center py-6 fade-enter-active">
                  <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-2"/>
                  <p className="text-red-600 font-bold">Item Not Found</p>
                  <p className="text-xs text-red-400">Check the code and try again.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}