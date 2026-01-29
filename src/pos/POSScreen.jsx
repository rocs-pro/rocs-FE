import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Bell } from 'lucide-react';
import BillPanel from './components/BillPanel';
import ControlPanel from './components/ControlPanel';
import ProductGrid from './components/ProductGrid';
import { posService } from '../services/posService'; 

// Notification context
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
  const [session, setSession] = useState({ isOpen: false, cashier: "--", shiftId: null });
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [inputBuffer, setInputBuffer] = useState("");
  const [invoiceId, setInvoiceId] = useState("INV-PENDING"); 
  const [shiftTotals, setShiftTotals] = useState(null);

  const [activeModal, setActiveModal] = useState('FLOAT'); 
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [listConfig, setListConfig] = useState(null); 
  
  // Track which item is being edited
  const [selectedCartIndex, setSelectedCartIndex] = useState(null);

  // Trigger to refresh product grid
  const [quickGridRefresh, setQuickGridRefresh] = useState(0);

  const [time, setTime] = useState(new Date());
  
  const inputRef = useRef(null);
  const { addNotification, setIsOpen, unreadCount } = useNotification();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // PREVENT REFRESH LOGIC
  useEffect(() => {
    // Block Keyboard Shortcuts (F5, Ctrl+R)
    const handleKeyDownBlocker = (e) => {
        if (!session.isOpen) return; // Allow refresh if not logged in

        // Check for F5 or Ctrl+R or Cmd+R (Mac)
        if (
            e.key === 'F5' || 
            ((e.ctrlKey || e.metaKey) && e.key === 'r')
        ) {
            e.preventDefault();
            addNotification('warning', 'Action Blocked', 'Refreshing is disabled while the shift is open.');
        }
    };

    // Block Browser Button / Tab Close
    const handleBeforeUnload = (e) => {
        if (!session.isOpen) return;

        // Standard way to trigger the "Leave Site?" dialog
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
  }, [session.isOpen, addNotification]); // Re-run if login state changes

  // Alert helper
  const showAlert = (title, message, onOk = () => {}) => {
      setConfirmConfig({ title, message, onYes: () => { onOk(); setActiveModal(null); }, isAlert: true });
      setActiveModal('CONFIRM');
  };

  // Confirm helper
  const showConfirm = (title, message, onYes) => {
      setConfirmConfig({ title, message, onYes: onYes, isAlert: false });
      setActiveModal('CONFIRM');
  };

  // Login handler
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
          setSession({ isOpen: true, cashier: cashierObj.name, shiftId: res.data.shiftId });
          setActiveModal(null);
          addNotification('success', 'Shift Opened', `Cashier ${cashierObj.name} logged in successfully.`);
      } catch (err) {
          addNotification('error', 'Login Failed', 'Invalid credentials or server error.');
          throw err; 
      }
  };

  // Logout handler
  const handleLogout = async (closingAmount, supervisorCreds) => {
      try {
          const payload = { shiftId: session.shiftId, amount: closingAmount, supervisor: supervisorCreds };
          await posService.closeShift(payload);
          
          // Manually close session before reload to allow the refresh
          setSession({ isOpen: false, cashier: "--", shiftId: null }); 
          
          addNotification('success', 'Shift Closed', 'System shutting down...');
          setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
          throw new Error("Supervisor credentials incorrect.");
      }
  };

  // Add item handler
  const handleAddToCart = async (productId) => {
    try {
        const res = await posService.getProduct(productId);
        const product = res.data; 
        
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            return [...prev, { ...product, qty: 1 }];
        });
    } catch (err) {
        addNotification('error', 'Item Not Found', `Product code '${productId}' does not exist.`);
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
          addNotification('warning', 'Empty Cart', 'Add items before processing payment.');
          return;
      }
      setListConfig({ mode }); 
      setActiveModal('PAYMENT');
  };

  // Payment processing
  const processPayment = async (paymentDetails) => {
      const orderData = {
          items: cart,
          total: paymentDetails.amount,
          customer: customer ? customer.id : null,
          paymentMethod: paymentDetails.method,
          tendered: paymentDetails.tendered,
          change: paymentDetails.change,
          shiftId: session.shiftId,
          // Card specific data
          bank: paymentDetails.bank,
          cardRef: paymentDetails.cardRef
      };

      try {
          const res = await posService.submitOrder(orderData);
          const newInvId = res.data.invoiceId || "INV-COMPLETED"; 
          
          addNotification('success', 'Payment Successful', `Invoice: ${newInvId} | Change: ${paymentDetails.change.toFixed(2)}`);
          
          setCart([]);
          setCustomer(null);
          setActiveModal(null);
          
          setInvoiceId("Calculating...");
          setTimeout(() => setInvoiceId("INV-PENDING"), 500); 
      } catch (err) {
          addNotification('error', 'Payment Failed', 'Transaction could not be processed.');
      }
  };

  const handleCartItemClick = (index) => {
      setSelectedCartIndex(index);
      setActiveModal('QUANTITY');
  };

  const handleQuantityUpdate = (newQty) => {
      if (selectedCartIndex !== null && newQty > 0) {
          setCart(prev => {
              const newCart = [...prev];
              newCart[selectedCartIndex] = { ...newCart[selectedCartIndex], qty: newQty };
              return newCart;
          });
          addNotification('info', 'Quantity Updated', `Item qty changed to ${newQty}`);
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
        addNotification('info', 'Item Voided', `${item.name} removed from bill.`);
    });
  };

  // Quick add handlers
  const handleOpenQuickAdd = () => {
      setActiveModal('QUICK_ADD');
  };

  const handleAddQuickItem = async (product) => {
      try {
          await posService.addQuickItem(product);
          setQuickGridRefresh(prev => prev + 1);
          addNotification('success', 'Quick Item Added', `${product.name} added to grid.`);
          setActiveModal(null);
      } catch (err) {
          addNotification('error', 'Save Failed', 'Could not add item to quick list.');
      }
  };

  const handleComplexAction = async (action) => {
      if(action === 'HOLD') {
          if(cart.length === 0) return;
          showConfirm("Suspend Transaction", "Park this transaction?", () => {
              setCart([]); setCustomer(null); setActiveModal(null);
              addNotification('info', 'Bill Held', 'Transaction parked successfully.');
          });
      } 
      else if (action === 'CANCEL') {
          if(cart.length === 0) return;
          showConfirm("Cancel Transaction", "Void entire bill?", () => {
              setCart([]); setCustomer(null); setActiveModal(null);
              addNotification('warning', 'Bill Cancelled', 'Current transaction cleared.');
          });
      }
      else if (action === 'RECALL') {
          showConfirm("Recall Bill", "Open Held Bills list?", () => {
              setListConfig({ type: 'RECALL' }); setActiveModal('LIST'); 
          });
      }
      else if (action === 'RETURN') {
          showConfirm("Return Bill", "Enter Return mode?", () => {
              setListConfig({ type: 'RETURN' }); setActiveModal('LIST'); 
          });
      }
      else if (action === 'EXIT') {
          setShiftTotals(null); 
          setActiveModal('END_SHIFT');
          try {
             if(session.shiftId) {
                 const res = await posService.getShiftTotals(session.shiftId);
                 setShiftTotals(res.data);
             }
          } catch(e) {
             console.error("Failed to fetch shift totals", e);
          }
      }
      else if (action === 'PAY_CASH') { openPaymentModal('CASH'); }
      else if (action === 'PAY_CARD') { openPaymentModal('CARD'); }
      else if (action === 'PAY_QR') { openPaymentModal('QR'); }
  };

  // Keyboard listeners
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
      
      if (e.key === ' ' || e.code === 'Space') { 
          e.preventDefault(); 
          handleComplexAction('PAY_CASH'); 
      }
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
        
        {/* Header */}
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
                
                {/* Online Dot */}
                <div className="relative flex items-center justify-center mx-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
                    <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>

                <button onClick={() => handleComplexAction('EXIT')} className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest border border-red-800 shadow-lg active:scale-95 transition-all w-auto">
                    EXIT <LogOut className="w-4 h-4" />
                </button>
            </div>
        </header>

        {/* Workspace */}
        <div className={`flex flex-1 overflow-hidden transition-all duration-500 ${!session.isOpen || activeModal ? 'blur-[3px] brightness-90' : ''}`}>
            <BillPanel cart={cart} customer={customer} onItemClick={handleCartItemClick} onDetachCustomer={() => setCustomer(null)}/>
            <ControlPanel inputRef={inputRef} inputBuffer={inputBuffer} setInputBuffer={setInputBuffer} onScan={handleScan} onOpenModal={setActiveModal} onAction={handleComplexAction} onVoid={() => handleVoidItem()} isEnabled={session.isOpen}/>
            <ProductGrid 
                onAddToCart={handleAddToCart} 
                onAddQuickItemClick={handleOpenQuickAdd}
                refreshTrigger={quickGridRefresh}
            />
        </div>

        {/* Modals & Notifications */}
        <NotificationPanel />

        {activeModal === 'FLOAT' && <FloatModal onApprove={handleLogin} branchId={BRANCH_ID} terminalId={TERMINAL_ID} />}
        {activeModal === 'END_SHIFT' && <EndShiftModal cashierName={session.cashier} expectedTotals={shiftTotals} onClose={() => setActiveModal(null)} onConfirm={handleLogout} />}
        
        {activeModal === 'PAYMENT' && (
            <PaymentModal 
                total={cart.reduce((a,c)=>a+c.price*c.qty,0)} 
                initialMethod={listConfig?.mode || 'CASH'}
                onClose={() => setActiveModal(null)} 
                onProcess={processPayment} 
            />
        )}

        {activeModal === 'QUANTITY' && selectedCartIndex !== null && (
            <QuantityModal 
                item={cart[selectedCartIndex]}
                onClose={() => setActiveModal(null)}
                onConfirm={handleQuantityUpdate}
            />
        )}

        {activeModal === 'QUICK_ADD' && (
            <QuickAddModal 
                onClose={() => setActiveModal(null)} 
                onProductSelected={handleAddQuickItem} 
            />
        )}
        
        {activeModal === 'PAID_IN' && <IOModal type="PAID_IN" onClose={() => setActiveModal(null)} onNotify={addNotification} />}
        {activeModal === 'PAID_OUT' && <IOModal type="PAID_OUT" onClose={() => setActiveModal(null)} onNotify={addNotification} />}
        {activeModal === 'PRICE_CHECK' && <PriceCheckModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'LOYALTY' && <LoyaltyModal onClose={() => setActiveModal(null)} onAttach={(c) => { setCustomer(c); setActiveModal(null); }} />}
        {activeModal === 'REGISTER' && <RegisterModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'CONFIRM' && confirmConfig && <ConfirmModal title={confirmConfig.title} message={confirmConfig.message} onConfirm={confirmConfig.onYes} onCancel={() => setActiveModal(null)} isAlert={confirmConfig.isAlert} />}
        
        {activeModal === 'LIST' && listConfig && (
            <ListModal 
                type={listConfig.type} 
                onClose={() => setActiveModal(null)} 
                onSelect={async (item) => { 
                    try {
                        const res = await posService.getBillById(item.id);
                        setListConfig(null); 
                        addNotification('success', 'Bill Loaded', `Bill #${item.id} retrieved.`);
                    } catch(e) { addNotification('error', 'Error', 'Failed to load bill.'); }
                }} 
            />
        )}
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