import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Bell } from 'lucide-react';
import BillPanel from './components/BillPanel';
import ControlPanel from './components/ControlPanel';
import ProductGrid from './components/ProductGrid';
import { posService } from '../services/posService'; 

// Context
import { NotificationProvider, useNotification } from './context/NotificationContext';
import NotificationPanel from './components/NotificationPanel';

// Modals
import PriceCheckModal from './modals/PriceCheckModal';
import LoyaltyModal from './modals/LoyaltyModal';
import IOModal from './modals/IOModal';
import RegisterModal from './modals/RegisterModal';
import ConfirmModal from './modals/ConfirmModal';
import ListModal from './modals/ListModal';
import FloatModal from './modals/FloatModal'; 
import EndShiftModal from './modals/EndShiftModal';
import PaymentModal from './modals/PaymentModal';
import QuantityModal from './modals/QuantityModal'; 
import QuickAddModal from './modals/QuickAddModal'; 

const BRANCH_ID = 1;
const TERMINAL_ID = 101; 

function POSContent() {
  const [session, setSession] = useState({ isOpen: false, cashier: "--", shiftId: null, userId: null });
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [inputBuffer, setInputBuffer] = useState("");
  const [invoiceId, setInvoiceId] = useState("INV-READY"); 
  const [shiftTotals, setShiftTotals] = useState(null);

  const [activeModal, setActiveModal] = useState('FLOAT'); 
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [listConfig, setListConfig] = useState(null); 
  
  const [selectedCartIndex, setSelectedCartIndex] = useState(null);
  const [quickGridRefresh, setQuickGridRefresh] = useState(0);
  const [time, setTime] = useState(new Date());
  
  const inputRef = useRef(null);
  const { addNotification, setIsOpen, unreadCount } = useNotification();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Invoice Logic
  useEffect(() => {
    if (cart.length > 0) {
        const isProvisional = /^INV-\d{6}-\d{4}$/.test(invoiceId);
        if (invoiceId === 'INV-READY' || invoiceId === 'INV-PENDING' || !isProvisional) {
            const datePart = new Date().toISOString().slice(2,10).replace(/-/g,"");
            const randomPart = Math.floor(1000 + Math.random() * 9000);
            setInvoiceId(`INV-${datePart}-${randomPart}`);
        }
    } 
  }, [cart.length, invoiceId]);

  // Block Refresh
  useEffect(() => {
    const handleKeyDownBlocker = (e) => {
        if (!session.isOpen) return; 
        if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key === 'r')) {
            e.preventDefault();
            addNotification('warning', 'Action Blocked', 'Refreshing is disabled while the shift is open.');
        }
    };
    const handleBeforeUnload = (e) => {
        if (!session.isOpen) return;
        e.preventDefault();
        e.returnValue = ''; 
        return '';
    };
    window.addEventListener('keydown', handleKeyDownBlocker);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
        window.removeEventListener('keydown', handleKeyDownBlocker);
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [session.isOpen, addNotification]); 

  // --- HANDLERS ---

  const handleLogin = async (cashierObj, amount, supervisorCreds) => {
      try {
          const payload = { 
              cashierId: cashierObj.id, 
              branchId: BRANCH_ID, 
              terminalId: TERMINAL_ID, 
              openingCash: parseFloat(amount), 
              supervisor: supervisorCreds 
          };
          
          const res = await posService.openShift(payload);
          const data = res.data;
          
          let theShiftId = null;
          if (typeof data === 'number') theShiftId = data;
          else if (data && typeof data === 'object') {
             const inner = data.data || data; 
             theShiftId = inner.shiftId || inner.id || inner;
          }

          if (!theShiftId) throw new Error("Invalid Shift ID received.");

          setSession({ 
              isOpen: true, 
              cashier: cashierObj.name, 
              shiftId: theShiftId,
              userId: cashierObj.id 
          });
          
          setActiveModal(null);
          addNotification('success', 'Terminal Open', `Shift #${theShiftId} started.`);
      } catch (err) {
          const msg = err.response?.data?.message || err.message || 'Login Failed';
          addNotification('error', 'Login Error', msg);
          throw err; 
      }
  };

  const handleLogout = async (closingAmount, supervisorCreds) => {
      try {
          await posService.closeShift({
              closingCash: parseFloat(closingAmount),
              notes: "Shift Closed",
              supervisorUsername: supervisorCreds.username,
              supervisorPassword: supervisorCreds.password
          });
          setSession({ isOpen: false, cashier: "--", shiftId: null, userId: null }); 
          addNotification('success', 'Shift Closed', 'System shutting down...');
          setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
          throw new Error("Logout failed: " + (err.response?.data?.message || err.message));
      }
  };

  const handleAddToCart = async (productCode) => {
    try {
        // Call the SCAN endpoint (Expects single object)
        const res = await posService.getProduct(productCode);
        const rawData = res.data?.data || res.data; 

        if (!rawData || Array.isArray(rawData)) {
             throw new Error("Invalid product data received");
        }

        const product = {
            id: rawData.id || rawData.productId,
            name: rawData.name,
            price: rawData.price !== undefined ? rawData.price : rawData.sellingPrice,
            sku: rawData.sku,
            barcode: rawData.barcode,
            qty: 1
        };
        
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            return [...prev, { ...product, qty: 1 }];
        });
        
        // Success Beep logic could go here
    } catch (err) {
        addNotification('error', 'Product Not Found', `Code '${productCode}' invalid.`);
    }
  };

  const handleScan = () => {
    if (!inputBuffer) return;
    handleAddToCart(inputBuffer);
    setInputBuffer("");
    inputRef.current?.focus();
  };

  const openPaymentModal = (mode = 'CASH') => {
      if(cart.length === 0) {
          addNotification('warning', 'Empty Cart', 'Add items first.');
          return;
      }
      if(!session.shiftId) {
          addNotification('error', 'System Error', 'No Active Shift.');
          return;
      }
      setListConfig({ mode }); 
      setActiveModal('PAYMENT');
  };

  const processPayment = async (paymentDetails) => {
      const mappedItems = cart.map(item => ({
          productId: item.id,
          quantity: item.qty,      
          unitPrice: item.price,   
          discount: 0,             
          serialId: null           
      }));

      const paymentList = [{
          paymentType: paymentDetails.method,
          amount: paymentDetails.tendered, 
          referenceNo: paymentDetails.cardRef || null,
          bankName: paymentDetails.bank || null,
          cardLast4: null
      }];

      const orderData = {
          customerId: customer ? customer.id : null,
          items: mappedItems,
          payments: paymentList,
          status: "PAID",
          notes: "",
          discount: 0,
          shiftId: session.shiftId,
          cashierId: session.userId,
          branchId: BRANCH_ID
      };

      try {
          const res = await posService.submitOrder(orderData);
          const data = res.data?.data || res.data;
          const finalInvoiceId = data?.invoiceNo || data?.invoiceId || "INV-DONE";
          
          setInvoiceId(finalInvoiceId); 
          addNotification('success', 'Sale Complete', `Invoice: ${finalInvoiceId}`);
          
          setCart([]);
          setCustomer(null);
          setActiveModal(null);
          
          setTimeout(() => { setInvoiceId("INV-READY"); }, 3000);
      } catch (err) {
          const msg = err.response?.data?.message || "Transaction failed";
          addNotification('error', 'Payment Failed', msg);
      }
  };

  // ... (Keep existing helpers: handleCartItemClick, handleQuantityUpdate, handleVoidItem)
  const handleCartItemClick = (index) => { setSelectedCartIndex(index); setActiveModal('QUANTITY'); };
  const handleQuantityUpdate = (newQty) => {
      if (selectedCartIndex !== null && newQty > 0) {
          setCart(prev => {
              const newCart = [...prev];
              newCart[selectedCartIndex] = { ...newCart[selectedCartIndex], qty: newQty };
              return newCart;
          });
      }
      setActiveModal(null);
      setSelectedCartIndex(null);
  };
  const handleVoidItem = (index) => {
    const targetIndex = index !== undefined ? index : cart.length - 1;
    if(targetIndex < 0 || targetIndex >= cart.length) return;
    const item = cart[targetIndex];
    showConfirm("Void Item", `Remove "${item.name}"?`, () => {
        const newCart = [...cart];
        newCart.splice(targetIndex, 1);
        setCart(newCart);
        setActiveModal(null);
        addNotification('info', 'Item Voided', `${item.name} removed.`);
    });
  };

  const handleComplexAction = async (action) => {
      if(action === 'HOLD') {
          if(cart.length === 0) return;
          showConfirm("Suspend Transaction", "Park this transaction?", () => {
              setCart([]); setCustomer(null); setActiveModal(null);
              addNotification('info', 'Bill Held', 'Transaction parked.');
          });
      } 
      else if (action === 'CANCEL') {
          if(cart.length === 0) return;
          showConfirm("Cancel Transaction", "Void entire bill?", () => {
              setCart([]); setCustomer(null); setActiveModal(null);
              setInvoiceId("INV-READY"); 
              addNotification('warning', 'Bill Cancelled', 'Transaction cleared.');
          });
      }
      else if (action === 'RECALL') {
          showConfirm("Recall Bill", "Open Held Bills list?", () => { setListConfig({ type: 'RECALL' }); setActiveModal('LIST'); });
      }
      else if (action === 'RETURN') {
          showConfirm("Return Bill", "Enter Return mode?", () => { setListConfig({ type: 'RETURN' }); setActiveModal('LIST'); });
      }
      else if (action === 'EXIT') {
          setShiftTotals(null); 
          setActiveModal('END_SHIFT');
          try {
             if(session.shiftId) {
                 const res = await posService.getShiftTotals(session.shiftId);
                 setShiftTotals(res.data?.data || res.data);
             }
          } catch(e) { console.error(e); }
      }
      else if (action === 'PAY_CASH') { openPaymentModal('CASH'); }
      else if (action === 'PAY_CARD') { openPaymentModal('CARD'); }
      else if (action === 'PAY_QR') { openPaymentModal('QR'); }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeModal && activeModal !== 'FLOAT') {
        if (e.key === 'Escape') { setActiveModal(null); setConfirmConfig(null); }
        return;
      }
      if (e.key === 'F1') { e.preventDefault(); setActiveModal('PRICE_CHECK'); }
      if (e.key === 'F3') { e.preventDefault(); handleComplexAction('RECALL'); }
      if (e.key === 'F4') { e.preventDefault(); handleComplexAction('CANCEL'); }
      if (e.key === 'F6') { e.preventDefault(); setActiveModal('PAID_IN'); }
      if (e.key === 'F7') { e.preventDefault(); setActiveModal('PAID_OUT'); }
      if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); handleComplexAction('PAY_CASH'); }
      if (e.key === 'F10') { e.preventDefault(); handleComplexAction('PAY_CARD'); }
      if (e.key === 'F11') { e.preventDefault(); handleComplexAction('PAY_QR'); }

      if (!activeModal && document.activeElement.tagName !== 'INPUT') {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, cart]);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden font-sans relative">
        <header className="bg-slate-900 text-white h-16 shrink-0 flex items-center justify-between px-4 shadow-md z-30 border-b border-slate-800">
            <div className="flex items-center gap-6">
                <div className="flex flex-col leading-none">
                    <span className="font-bold text-2xl text-green-400 tracking-tight">POS-01</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Colombo Main</span>
                </div>
                <div className="h-8 w-px bg-slate-700"></div>
                <div className="bg-slate-800/50 px-4 py-1 rounded-md border border-slate-700 flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">INV:</span>
                    <span className="font-mono text-xl font-bold text-white tracking-widest">{invoiceId}</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>}
                </button>
                <div className="flex items-center gap-3 bg-blue-900/40 border border-blue-500/30 rounded-full py-1.5 px-4">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold tracking-wide uppercase text-blue-100">{session.cashier}</span>
                </div>
                <div className="text-right leading-tight hidden md:block">
                    <div className="font-mono text-2xl font-bold text-white tracking-widest">
                        {time.toLocaleTimeString('en-US', { hour12: false })}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
                    </div>
                </div>
                <button onClick={() => handleComplexAction('EXIT')} className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest border border-red-800 shadow-lg active:scale-95 transition-all w-auto">
                    EXIT <LogOut className="w-4 h-4" />
                </button>
            </div>
        </header>

        <div className={`flex flex-1 overflow-hidden transition-all duration-500 ${!session.isOpen || activeModal ? 'blur-[3px] brightness-90' : ''}`}>
            <BillPanel cart={cart} customer={customer} onItemClick={handleCartItemClick} onDetachCustomer={() => setCustomer(null)}/>
            <ControlPanel inputRef={inputRef} inputBuffer={inputBuffer} setInputBuffer={setInputBuffer} onScan={handleScan} onOpenModal={setActiveModal} onAction={handleComplexAction} onVoid={() => handleVoidItem()} isEnabled={session.isOpen}/>
            <ProductGrid 
                onAddToCart={handleAddToCart} 
                onAddQuickItemClick={() => setActiveModal('QUICK_ADD')} 
                refreshTrigger={quickGridRefresh}
            />
        </div>

        <NotificationPanel />

        {activeModal === 'FLOAT' && <FloatModal onApprove={handleLogin} branchId={BRANCH_ID} terminalId={TERMINAL_ID} />}
        {activeModal === 'END_SHIFT' && <EndShiftModal cashierName={session.cashier} expectedTotals={shiftTotals} onClose={() => setActiveModal(null)} onConfirm={handleLogout} />}
        {activeModal === 'PAYMENT' && <PaymentModal total={cart.reduce((a,c)=>a+c.price*c.qty,0)} initialMethod={listConfig?.mode || 'CASH'} onClose={() => setActiveModal(null)} onProcess={processPayment} />}
        {activeModal === 'QUANTITY' && selectedCartIndex !== null && <QuantityModal item={cart[selectedCartIndex]} onClose={() => setActiveModal(null)} onConfirm={handleQuantityUpdate} />}
        {activeModal === 'QUICK_ADD' && <QuickAddModal onClose={() => setActiveModal(null)} onProductSelected={async (item) => { await handleAddToCart(item.id || item.productId); setActiveModal(null); }} />}
        {activeModal === 'PAID_IN' && <IOModal type="PAID_IN" onClose={() => setActiveModal(null)} onNotify={addNotification} />}
        {activeModal === 'PAID_OUT' && <IOModal type="PAID_OUT" onClose={() => setActiveModal(null)} onNotify={addNotification} />}
        {activeModal === 'PRICE_CHECK' && <PriceCheckModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'LOYALTY' && <LoyaltyModal onClose={() => setActiveModal(null)} onAttach={(c) => { setCustomer(c); setActiveModal(null); }} />}
        {activeModal === 'REGISTER' && <RegisterModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'CONFIRM' && confirmConfig && <ConfirmModal title={confirmConfig.title} message={confirmConfig.message} onConfirm={confirmConfig.onYes} onCancel={() => setActiveModal(null)} isAlert={confirmConfig.isAlert} />}
        {activeModal === 'LIST' && listConfig && <ListModal type={listConfig.type} onClose={() => setActiveModal(null)} onSelect={async (item) => { try { await posService.getBillById(item.id); setListConfig(null); addNotification('success', 'Bill Loaded', `Bill #${item.id} retrieved.`); } catch(e) { addNotification('error', 'Error', 'Failed to load bill.'); } }} />}
    </div>
  );
}

export default function POSScreen() {
    return (
        <NotificationProvider>
            <POSContent />
        </NotificationProvider>
    );
}